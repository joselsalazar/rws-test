// Global Variables 
let storedUsers = [];
let storedPasswords = [];
let storedAltPass = [];
let e = 3; 

// RWS Script Below For AJAX
rwsAJAXPostAJAX("https://mingle.rwsgateway.com/front-end-dev-skills-test/accounts/get", [], false, onResponse);

function onResponse(response)
{
	for (var i = 0; i < response.credentials.length; i++) {
		storedUsers.push(response.credentials[i].username);
		storedPasswords.push(response.credentials[i].password);
		storedAltPass.push(response.credentials[i].password2);
	}

	console.log(response);
}

// Cycles on Attempts
function cycleE() {
	e--;
}

// Form Reset
function clearForms() {
	$('#username').val("");
	$('#password').val("");
}

// Fail Function
function fail() {
	cycleE();
	clearForms();
}

function success(username, str) {
	$('.login-form').hide();
	$('#warning').hide();
	$('#message-div').html(`
		<h2>Alright! ${username}! ${str}</h2>
		<iframe width="560" height="315" src="https://www.youtube.com/embed/2cjbSgy3vSw?rel=0&autoplay=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen>
		</iframe>
	`);
}

// Pull Values From Form
$('#log-in').on('submit', function () {
	event.preventDefault();

	let usernameInput = $('#username').val().trim();
	let passwordInput = $('#password').val().trim();

	console.log(`Username: ${usernameInput}, Password: ${passwordInput} `);
	console.log(e);

	let arrayPos = storedUsers.indexOf(usernameInput);

	if (e <= 0) {
		$('.login-form').hide();
		$('#warning').html("You have been locked out. Too many attempts!");
		$('#message-div').html(`
			<img src="img/get-out.gif">
		`);
	} else {
		if (arrayPos > -1) {
			if (passwordInput === storedPasswords[arrayPos] || passwordInput === storedAltPass[arrayPos]) {
				console.log("Success!");
				success(usernameInput, "Welcome to the Club!");
			} else if (storedPasswords[arrayPos] === undefined || storedPasswords[arrayPos] === "") {
				console.log("Success! But you need a PW!");
				success(usernameInput, "You really need to set up a Password. SECURITY BRO!");
			} else {
				$("#warning").html(`FAILURE! PASSWORD IS WRONG! ${e} ATTEMPTS REMAINING!`);
				fail();
			}
		} else {
			$("#warning").html(`FAILURE! USERNAME IS WRONG! ${e} ATTEMPTS REMAINING!`);
			fail();
		}
	}
});