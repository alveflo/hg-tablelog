# hg-tablelog
Table output for `hg log`. Limits to 100 entries by default.

## Requirements
`node.js`

## Install
```
$ git clone <this repo>
$ cd hg-tablelog
$ npm install
```
## Register alias
Add this to your `mercurial.ini` (`~\.hgrc` if you're running unix)
```
[alias]
tlog = !powershell.exe node C:\<full path>\hg-extras\tablelog.js $1
```
## Usage
```
Limits to 100 entries (default)
$ hg tlog

Limits to 15 entries:
$ hg tlog 15
```
## License
MIT
