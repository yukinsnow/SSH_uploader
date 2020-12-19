// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { dialog } = require('electron').remote
var Client = require('electron-ssh2').Client

const selectButton = document.getElementById('selectButton')
const connectButton = document.getElementById('connectButton')
const disconnectButton = document.getElementById('disconnectButton')
const uploadButton = document.getElementById('uploadButton')
var localPath = ''
var remotePath = ''
const statusBar = document.getElementById('statusBar')

selectButton.addEventListener('click', function(e) {
  OpenDialog()
})

connectButton.addEventListener('click', function(e) {
  var server = document.getElementById('server').value
  var username = document.getElementById('username').value
  var password = document.getElementById('password').value
  Connect(server,username,password)
})

disconnectButton.addEventListener('click', function(e) {
  Disconnect()
})

uploadButton.addEventListener('click', function(e) {
  var str = localPath.split('/')
  var files = str[str.length-1]
  remotePath = document.getElementById('remotePath').value+'/'+files
  Upload(localPath,remotePath)
})

function OpenDialog()
{
    dialog.showOpenDialog({
        title: "Select local file",
        buttonLabel: "Select"
    }).then(result => {
        //console.log(result.canceled)
        var path = result.filePaths[0]
        document.getElementById('localPath').value = path
        localPath = path
      }).catch(err => {
        console.log(err)
      })
}

var conn = new Client()

function Connect(server,username,password)
{
  conn.on('ready', function() {
  statusBar.innerHTML = '<span class="icon icon-record" style="color:#34c84a;margin-right: 2px;"></span>Server connected <span class="pull-right"><span class="icon icon-github"></span>Yukinsnow</span>'
}).connect({
  host: server,
  port: 22,
  username: username,
  password: password,
  privateKey: ""
});
}

function Disconnect()
{
  conn.on('end', function() {
    statusBar.innerHTML = '<span class="icon icon-record" style="color:#fc605b;margin-right: 2px;"></span>Server disconnected <span class="pull-right"><span class="icon icon-github"></span>Yukinsnow</span>'
	})
	conn.end()
}

function Upload(localPath, remotePath)
{
  conn.sftp(function(err, sftp){
		if(err){
      statusBar.innerHTML = '<span class="icon icon-record" style="color:##34c84a;margin-right: 2px;"></span>Server connected File upload failed<span class="icon icon-cancel" style="color:#fc605b;margin-left: 2px;"></span><span class="pull-right"><span class="icon icon-github"></span>Yukinsnow</span>'
		}else{
			sftp.fastPut(localPath, remotePath, function(err, result) {
        console.log(localPath)
        console.log(remotePath)
        statusBar.innerHTML = '<span class="icon icon-record" style="color:#34c84a;margin-right: 2px;"></span>Server connected File uploaded successfully<span class="icon icon-check" style="color:#34c84a;margin-left: 2px;"></span><span class="pull-right"><span class="icon icon-github"></span>Yukinsnow</span>'
				sftp.end()
			})
		}
	})
}