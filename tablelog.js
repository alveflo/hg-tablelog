var exec = require('child_process').exec;
var Table = require('cli-table');
var colors = require('colors');

var table = new Table({
    head: ['Branch'.green, 'User'.green, 'Date'.green, 'Summary'.green]
});

function execute(command, callback){
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("abort: no repository found");
        return;
      }
      if (stderr) {
        console.log("abort: no repository found");
        return;
      }
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

var limit = 100;

if (process.argv[2]) {
  limit = process.argv[2];
}

execute("hg log --limit " + limit, (output) => {
  var content = output.split("\n").reverse();
  var regex = /([a-z]+):\s+(.*)/;
  var entries = [];
  var current = {};
  var add = false;
  for (var index in content) {
    entry = content[index];
    if (entry === '' || index == (content.length-1)) {
      if (add) {
        entries.push(current);
        var user = (current.user || "").replace(" <", "\n<").split("\n");
        var date = (current.date || "n/a n/a n/a n/a n/a").split(" ");
        var desc = addNewlines(current.summary || "");
        var branch = current.branch.replace("/","\n - ") || 'default'.blue;
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
