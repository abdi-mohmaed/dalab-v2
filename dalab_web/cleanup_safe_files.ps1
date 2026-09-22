# Dalab Project Cleanup Script
# This script safely deletes temporary files, logs, and debug files
# Run this from the project root directory: c:\Users\user\dalab

Write-Host "Dalab Project Cleanup Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Set project root
$projectRoot = "c:\Users\user\dalab"
Set-Location $projectRoot

# Create backup directory
$backupDir = ".\cleanup_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Write-Host "Creating backup directory: $backupDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Counter for deleted files
$deletedCount = 0
$totalSize = 0

# Function to safely delete file
function Remove-SafeFile {
    param($filePath)
    if (Test-Path $filePath) {
        $fileInfo = Get-Item $filePath
        $script:totalSize += $fileInfo.Length
        Write-Host "  Deleting: $filePath" -ForegroundColor Gray
        Remove-Item $filePath -Force
        $script:deletedCount++
        return $true
    }
    return $false
}

Write-Host "`n[1/4] Removing temporary image files..." -ForegroundColor Green
Remove-SafeFile "temp_dalab_2047eff4.png"
Remove-SafeFile "temp_dalab_beea00af.png"
Remove-SafeFile "temp_dalab_cae61799.png"

Write-Host "`n[2/4] Removing log files..." -ForegroundColor Green
$logFiles = @(
    "ingest_care_v4.log",
    "ingest_home_v2.log",
    "ingest_home_v3.log",
    "ingest_home_v4.log",
    "ingest_log.txt",
    "ingest_log_v2.txt",
    "ingest_log_v4.txt",
    "ingest_log_v4_utf8.txt",
    "ingest_log_v5.txt",
    "ingest_log_v5_utf8.txt",
    "ingest_log_v6.txt",
    "ingest_log_v6_utf8.txt",
    "ingest_mobiles.log",
    "ingest_mobiles_v2.log",
    "ingestion_errors.log",
    "logs.txt",
    "py_debug_out.txt",
    "py_debug_utf8.txt"
)

foreach ($log in $logFiles) {
    Remove-SafeFile $log
}

Write-Host "`n[3/4] Removing debug/status files..." -ForegroundColor Green
$debugFiles = @(
    "count_result.txt",
    "db_check_result.json",
    "db_status.txt",
    "ids.txt",
    "ids_debug.json",
    "category_ids.json"
)

foreach ($debug in $debugFiles) {
    Remove-SafeFile $debug
}

Write-Host "`n[4/4] Removing build artifacts and temp configs..." -ForegroundColor Green
Remove-SafeFile "tsconfig.tsbuildinfo"
Remove-SafeFile "tsconfig.cleanup.json"

# Summary
Write-Host "`n=============================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Files deleted: $deletedCount" -ForegroundColor Yellow
Write-Host "Space freed: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' to verify the app still works" -ForegroundColor White
Write-Host "2. Review the files in 'final_cleanup_list.md' for additional cleanup" -ForegroundColor White
Write-Host "3. If everything works, you can delete the backup directory" -ForegroundColor White
Write-Host ""
