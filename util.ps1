Get-ChildItem | Rename-Item –NewName { $_.basename –replace " | \(","" };
Get-ChildItem | Rename-Item -NewName {$_.basename -replace "\)",""}; 
Get-ChildItem | Rename-Item -NewName {$_.basename -replace "\(",""}
# rename default windows renamed groups to remove spaces and parens