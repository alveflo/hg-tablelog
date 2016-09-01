var exec = require('child_process').exec;
var Table = require('cli-table');
var colors = require('colors');

var table = new Table({
    head: ['Branch'.green, 'User'.green, 'Date'.green, 'Summary'.green]
});

function execute(command, callback){
    exec(command, (error, stdout, stderr) => {
      if (error) console.log(error);
      callback(stdout);
    });
};

function addNewlines(x) {
  if (!x) return;
  str = x.split(" ");
  var result = "";
  var line = "";
  for (var s in str) {
    s = str[s];
    if ((line.length + s.length) > 30) {
      result += line + "\n";
      line = "";
    }
    line += s + " ";
  }
  if (line !== "") result += line;
  return result;
}

execute("hg log --limit 20", (output) => {
  var content = output.split("\n").reverse();
  var regex = /([a-z]+):\s+(.*)/;
  var entries = [];
  var current = {};
  var add = false;
  for (var entry in content) {
    entry = content[entry];
    if (entry === '') {
      if (add) {
        entries.push(current);
        var user = (current.user || "").replace(" <", "\n<").split("\n");
        var date = (current.date || "n/a n/a n/a n/a n/a").split(" ");
        var desc = addNewlines(current.summary || "");
        var branch = current.branch || 'default'.blue;
        if (branch === "develop") branch = branch.yellow;
        if (branch.indexOf("release") !== -1) branch = branch.green;
        var e = {
          'name': user[0].white,
          'email': user[1].replace("<","").replace(">","").gray,
          'date': date[1].white + " " + date[2].white + "\n" + date[4].gray
        };


        table.push([
          branch,
          e.name + '\n' + e.email || '',
          e.date || '',
          desc
        ]);
      }
      current = {};
      add = false;
    } else {
      add = true;
      var m = regex.exec(entry);
      current[m[1]] = m[2];
    }
  }
  console.log(table.toString());
});
