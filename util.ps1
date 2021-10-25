Get-ChildItem | Rename-Item –NewName { $_.Name –replace " | \(","" };
Get-ChildItem | Rename-Item -NewName {$_.Name -replace "\)",""}; 
Get-ChildItem | Rename-Item -NewName {$_.Name -replace "\(",""}



# create a function to add 100 to a number and return the result
function add100 {
    $number = $_[0]
    $number + 100
}    

# create a function that gets a random joke from the internet and returns the result
function getJoke {
    $url = "http://api.icndb.com/jokes/random"
    Write-Output (Invoke-RestMethod -Uri $url).Content.joke
}