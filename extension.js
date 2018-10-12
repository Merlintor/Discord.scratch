$.getScript('https://discord.club/static/test/index.js', function() {

(function(ext) {
	ext.on_ready = false;
	ext.prefix = "!";
	ext.on_message = false;
	ext.last_message = ["", 0, 0, ""];

	// Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.startswith = function(message, start) {
    	return message.startsWith(start) == true;
    };

    ext.init = function(token) {
    	ext.client = new Discord.Client({
    		token: token,
    		autorun: false
    	});

    	ext.client.on('ready', function() {
    		console.log("Connected to " + ext.client.id);
    		ext.ready = true;
		});

		ext.client.on('message', function(user, userID, channelID, message, event) {
			if (event.d.author.id === ext.client.id) return;
			ext.on_message = true;
			ext.last_message = [user, userID, channelID, message, event];
		});

    };

    ext.connect = async function(callback) {
    	await ext.client.connect();
    	callback();
    }

    ext.check_for_ready = function() {
    	return ext.ready;
    }

    ext.check_for_command = function(prefix) {
    	if (ext.on_message == true) {
    		ext.on_message = false;
    		ext.prefix = prefix;
    		if(ext.last_message[3].startsWith(prefix) == true) {
    			return true;
    		}
    	}

    	return false;
    };

    ext.get_user_name = function() {
    	return ext.last_message[0];
    };

    ext.get_user_id = function() {
    	return ext.last_message[1];
    };

    ext.get_channel_id = function() {
    	return ext.last_message[2];
    };

    ext.get_message = function() {
    	return ext.last_message[3];
    };

    ext.get_command = function() {
    	return ext.last_message[3].substring(ext.prefix.length).split(" ")[0];
    };

    ext.get_argument = function(index) {
    	return ext.last_message[3].substring(ext.prefix.length).split(" ")[index];
    };

    ext.send_message = async function(channelID, content, callback) {
    	await ext.client.sendMessage({
    		to: channelID,
    		message: content
    	})
    	callback();
    };

    ext.set_activity = async function(type, name, url, callback) {
    	var types = {
    		"playing": 0,
    		"watching": 3,
    		"listening": 2,
    		"streaming": 1
    	}
    	await ext.client.setPresence({
    		idle_since: null,
    		game: {
    			name: name,
    			url: url,
    			type: types[type]
    		}
    	})
    	callback();
    }

    var descriptor = {
        blocks: [
        	['b', '%s startswith %s', 'startswith', '!ping', '!'],

        	[' ', 'set token %s', 'init', "your bot token"],
        	['w', 'connect', 'connect'],

        	['w', 'send message %s %s', 'send_message', 'channelID', 'content'],
        	['w', 'set activity %m.activity_types %s %s', 'set_activity', 'playing', 'name', 'url'],

        	['h', 'on ready', 'check_for_ready'],

        	['h', 'on command %s', 'check_for_command', ext.prefix],
        	['r', 'user name', 'get_user_name'],
        	['r', 'user id', 'get_user_id'],
        	['r', 'channel id', 'get_channel_id'],
        	['r', 'message', 'get_message'],
        	['r', 'command', 'get_command'],
        	['r', 'get arg %n', 'get_argument', 1]
        ],
        menus: {
        	activity_types: ['playing', 'watching', 'streaming', "listening"],
    	},
    	url: 'https://github.com/Merlintor/Discord.scratch',
    	displayName: 'Discord.scratch'
    };

    ScratchExtensions.register('Discord', descriptor, ext);

})({});

});