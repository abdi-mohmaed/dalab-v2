import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const { text, title, type } = await req.json();

        if (!text && !title) {
            return NextResponse.json({ error: 'Missing content to rewrite' }, { status: 400 });
        }

        const apiUrl = process.env.AI_API_URL;
        const modelName = process.env.AI_MODEL_NAME;

        if (!apiUrl) {
            return NextResponse.json({ error: 'AI API URL not configured' }, { status: 500 });
        }

        let prompt = '';
        if (type === 'description') {
            prompt = `Rewrite the following product description to be more professional, engaging, and marketplace-ready. 
            Product Title: ${title || 'Unnamed Product'}
            Current Description: ${text}
            
            Return ONLY the rewritten description text. Do not include any other text or markdown formatting.`;
        } else if (type === 'extract_info') {
            prompt = `Analyze the following product information and extract key specifications like Weight, Material, Dimensions, or Power if applicable.
            Product Title: ${title || 'Unnamed Product'}
            Description: ${text}
            
            Return a JSON object with key-value pairs of the extracted information. 
            Example: {"Weight": "250g", "Material": "Stainless Steel"}
            Return ONLY the JSON object.`;
        } else {
            prompt = `Rewrite or enhance the following product text: ${text}`;
        }

        const payload = {
            model: modelName || 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: [{ type: 'text', text: prompt }]
            }],
            temperature: 0.1
        };

        const response = await axios.post(apiUrl, payload, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let content = (response.data as any).choices[0].message.content.trim();

        // Clean up markdown if AI included it
        if (content.startsWith('```json')) {
            content = content.replace('```json', '').replace('```', '').trim();
        } else if (content.startsWith('```')) {
            content = content.replace('```', '').replace('```', '').trim();
        }

        return NextResponse.json({ result: content });

    } catch (error: any) {
        console.error('AI Rewrite Error:', error);
        return NextResponse.json({
            error: 'Failed to rewrite with AI',
            details: error.message
        }, { status: 500 });
    }
}
