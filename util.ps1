Get-ChildItem | Rename-Item –NewName { $_.Name –replace " | \(", "" };
Get-ChildItem | Rename-Item -NewName { $_.Name -replace "\)", "" }; 
Get-ChildItem | Rename-Item -NewName { $_.Name -replace "\(", "" }


$jsonFiles = Get-ChildItem . *.json -rec
foreach ($file in $jsonFiles) {
    (Get-Content $file.PSPath) |
    Foreach-Object { $_ -replace "\(Frame", "" } |
    Set-Content $file.PSPath 
}

$jsonFiles = Get-ChildItem . *.json -rec
foreach ($file in $jsonFiles) {
    (Get-Content $file.PSPath) |
    Foreach-Object { $_ -replace "\)", "" } |
    Set-Content $file.PSPath 
}