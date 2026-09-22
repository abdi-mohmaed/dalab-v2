import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const configStr = formData.get('config') as string;
        const imageFile = formData.get('image') as File | null;

        if (!configStr) {
            return NextResponse.json({ error: 'Missing configuration' }, { status: 400 });
        }

        const config = JSON.parse(configStr);
        let tempImagePath = '';

        // Handle temporary image storage for the generator
        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const tempDir = path.join(process.cwd(), 'tmp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

            tempImagePath = path.join(tempDir, `${randomUUID()}_${imageFile.name}`);
            fs.writeFileSync(tempImagePath, buffer);
            config.image_path = tempImagePath;
        }

        // Path to the python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'ai_banner_generator.py');

        // Execute the python script
        const result = await new Promise<string>((resolve, reject) => {
            const pythonProcess = spawn('python', [scriptPath, JSON.stringify(config)]);

            let output = '';
            let error = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(error || `Python process exited with code ${code}`));
                } else {
                    resolve(output.trim());
                }
            });
        });

        // Cleanup temp image
        if (tempImagePath && fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath);
        }

        if (result.startsWith('SUCCESS:')) {
            const fileName = result.replace('SUCCESS:', '');
            // Assuming the script saves to public/uploads/banners
            return NextResponse.json({
                success: true,
                url: `/uploads/banners/${fileName}`
            });
        } else {
            return NextResponse.json({ error: result }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
