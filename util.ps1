Get-ChildItem | Rename-Item –NewName { $_.Name –replace " | \(","" };
Get-ChildItem | Rename-Item -NewName {$_.Name -replace "\)",""}; 
Get-ChildItem | Rename-Item -NewName {$_.Name -replace "\(",""}
# rename default windows renamed groups to remove spaces and parens