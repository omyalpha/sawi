'use strict';


/*
|------------------------------------------------------------------------------
| Get user info
|------------------------------------------------------------------------------
*/
myApp.onPageInit('*', function(page) {
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'savedtoken=' + savedtoken;
		console.log("retrieved token: "+savedtoken);
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/getdata.php",
			data: dataString, // send token to grab data
			success: function(data) {
			   var obj = JSON.parse(data);
			   localStorage.setItem("id",obj[0].id);
			   localStorage.setItem("code",obj[0].code);
			   localStorage.setItem("name",obj[0].name);
			   localStorage.setItem("nationality",obj[0].nationality);
			   localStorage.setItem("address",obj[0].address);
			   localStorage.setItem("country",obj[0].country);
			   localStorage.setItem("dob",obj[0].dob);
			   localStorage.setItem("phone1",obj[0].phone1);
			   localStorage.setItem("phone2",obj[0].phone2);
			   localStorage.setItem("idtype",obj[0].idtype);
			   localStorage.setItem("idnumber",obj[0].idnumber);
			   localStorage.setItem("username",obj[0].username);
			   localStorage.setItem("email",obj[0].email);
			   localStorage.setItem("created",obj[0].created);
			   localStorage.setItem("creditline",obj[0].creditline);
			   $('.name').html(obj[0].name);
			   $('.username').html(obj[0].username);
			   $('.code').html(obj[0].code);
			   $('.address').html(obj[0].address);
			   $('.country').html(obj[0].country);
			   $('.dob').html(obj[0].dob);
			   $('.phone1').html(obj[0].phone1);
			   $('.phone2').html(obj[0].phone2);
			   $('.email').html(obj[0].email);
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				myApp.alert(errormsg+":"+textStatus);
			}
		});
		console.log('username: '+localStorage.getItem("username"));
		$('.onlyloggedin').show();
		$('.onlyloggedout').hide();
	} else {
		$('.onlyloggedin').hide();
		$('.onlyloggedout').show();
		$('.myname').text("");
		console.log("no token found");
	}
});

/*
|------------------------------------------------------------------------------
| User Profile
|------------------------------------------------------------------------------
*/

myApp.onPageInit('edit-profile', function(page) {

	$('#name').val(localStorage.getItem("name"));
	$('#username').val(localStorage.getItem("username"));
	$('#address').val(localStorage.getItem("address"));
	$('#country').val(localStorage.getItem("country"));
	$('#dob').val(localStorage.getItem("dob"));
	$('#phone1').val(localStorage.getItem("phone1"));
	$('#phone2').val(localStorage.getItem("phone2"));
	$('#email').val(localStorage.getItem("email"));
	
	// country.innerHTML = "<option value=" + (localStorage.getItem("country")) + " selected>" + (localStorage.getItem("country")) + "</option>" + country.innerHTML;
	//after creating the DOM then you can call in the create smart-select
	//app.smartSelect.create('.smart-select')
	
	$$(".editBtn").on('click', function(e){
		e.preventDefault();
		var form = $("#editForm");
		console.log('edit btn clicked');
		console.log(form);
		var savedtoken = localStorage.getItem("token");
		
		//run Ajax script here
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/editprofile.php?savedtoken="+savedtoken,
			data: form.serialize(), // serializes the form's elements.
			success: function(data) {
				mainView.loadPage('profile.html');
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				myApp.alert(errormsg);
			}
		});
	});

});

/*
|------------------------------------------------------------------------------
| home
|------------------------------------------------------------------------------
*/

myApp.onPageInit('home', function(page) {
	
	// re-get all info
	function regetall() {
		// re-get all info
		sending=$('#SendingBranch').val();
		receiving=$('#ReceivingBranch').val();
		payablenow=$('#payablenow').val();
		tobereceived=$('#tobereceived').val();
		receivecurrency=$('#rcurrency').val();
		sendcurrency=$('#scurrency').val();
	}
	
	// populate the branches dropdowns
	$.ajax({
		beforeSend: function() { myApp.showIndicator(); },
		complete: function(){ myApp.hideIndicator(); },
		dataType: 'json',
		type: "GET",
		url: "http://webhosting.sd/sawi/php/getbranches.php",
		success: function(data) {
			console.log(data);
			//var obj = JSON.parse(data);
			
			$('#ReceivingBranch').empty(); // clear the current elements in select box
			for (var row in data) {
				$('#ReceivingBranch').append($('<option></option>').attr('value', data[row].id).text(data[row].name));
			}
			
			$('#SendingBranch').empty(); // clear the current elements in select box
			for (row in data) {
				$('#SendingBranch').append($('<option></option>').attr('value', data[row].id).text(data[row].name));
			}
			
			// set currencies
			if (data[0].country=="Canada") {
				$('#scurrency').append($('<option></option>').attr('value', 'CAD').text('CAD'));
				$('#rcurrency').append($('<option></option>').attr('value', 'CAD').text('CAD'));
			} else if (data[0].country=="Egypt") {
				$('#scurrency').append($('<option></option>').attr('value', 'EGP').text('EGP'));
				$('#rcurrency').append($('<option></option>').attr('value', 'EGP').text('EGP'));
			} else if (data[0].country=="Emirates") {
				$('#scurrency').append($('<option></option>').attr('value', 'AED').text('AED'));
				$('#rcurrency').append($('<option></option>').attr('value', 'AED').text('AED'));
			} else if (data[0].country=="Jordan") {
				$('#scurrency').append($('<option></option>').attr('value', 'JOD').text('JOD'));
				$('#rcurrency').append($('<option></option>').attr('value', 'JOD').text('JOD'));
			} else if (data[0].country=="Saudi") {
				$('#scurrency').append($('<option></option>').attr('value', 'SAR').text('SAR'));
				$('#rcurrency').append($('<option></option>').attr('value', 'SAR').text('SAR'));
			} else if (data[0].country=="Sudan") {
				$('#scurrency').append($('<option></option>').attr('value', 'SDG').text('SDG'));
				$('#scurrency').append($('<option></option>').attr('value', 'USD').text('USD'));
				$('#rcurrency').append($('<option></option>').attr('value', 'SDG').text('SDG'));
				$('#rcurrency').append($('<option></option>').attr('value', 'USD').text('USD'));
			} else if (data[0].country=="UK") {
				$('#scurrency').append($('<option></option>').attr('value', 'GBP').text('GBP'));
				$('#rcurrency').append($('<option></option>').attr('value', 'GBP').text('GBP'));
			} else if (data[0].country=="USA") {
				$('#scurrency').append($('<option></option>').attr('value', 'USD').text('USD'));
				$('#rcurrency').append($('<option></option>').attr('value', 'USD').text('USD'));
			}

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
			var errormsg=XMLHttpRequest.responseText;
			myApp.alert(errormsg);
		}
	});
	
	$('#SendingBranch').on('change', function() {
		var sending=$('#SendingBranch').val();
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			url: 'http://webhosting.sd/sawi/php/select.php',
			dataType: 'json',
			type: 'GET',
			data: { branchid: sending },
			success: function(data) {
				$('#scurrency').empty(); // clear the current elements in select box
				for (var row in data) {
					$('#scurrency').append($('<option></option>').attr('value', data[row].id).text(data[row].name));
					console.log(data[row].id);
				}
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				myApp.alert(errormsg);
			}
		});
	});
	
	$('#ReceivingBranch').on('change', function() {
		var receiving=$('#ReceivingBranch').val();
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			url: 'http://webhosting.sd/sawi/php/select.php',
			dataType: 'json',
			type: 'GET',
			data: { branchid: receiving },
			success: function(data) {
				$('#rcurrency').empty(); // clear the current elements in select box
				for (var row in data) {
					$('#rcurrency').append($('<option></option>').attr('value', data[row].id).text(data[row].name));
					console.log(data[row].id);
				}
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				myApp.alert(errormsg);
			}
		});
	});
	$('#rcurrency').on('change', function() {
		$('#payablenow').val('');
		$('#tobereceived').val('');
	});
	$('#scurrency').on('change', function() {
		$('#payablenow').val('');
		$('#tobereceived').val('');
	});
	
	// reverse - payable now
	$('#payablenow').on('input', function() {
		var sending=$('#SendingBranch').val();
		var receiving=$('#ReceivingBranch').val();
		var payablenow=$('#payablenow').val();
		var receivecurrency=$('#rcurrency').val();
		var sendcurrency=$('#scurrency').val();
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			url: 'http://webhosting.sd/sawi/php/reverse.php',
			dataType: 'text',
			type: 'GET',
			data: { sending: sending, receiving: receiving, payablenow: payablenow, receivecurrency: receivecurrency, sendcurrency: sendcurrency },
			success: function(data) {
				console.log(data);
				var array = data.split("xx");
				var tobereceived=array[3];
				var rate=array[4];
				
				$('#tobereceived').val(tobereceived);
				$('#rate').val(rate);
				
				},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
				//bootbox.alert('<i class="fa fa-times font-red"></i> '+errorThrown);
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			beforeSend: function(){
				$(".proceedBtn").attr("disabled", true);
			},
			complete: function(){
				$(".proceedBtn").attr("disabled", false);
			}
		});
	});

	// reverse receive - tobereceived
	$('#tobereceived').on('input', function() {
		var sending=$('#SendingBranch').val();
		var receiving=$('#ReceivingBranch').val();
		var tobereceived=$('#tobereceived').val();
		var receivecurrency=$('#rcurrency').val();
		var sendcurrency=$('#scurrency').val();
		$.ajax({
			url: 'ajax/reversereceive.php',
			dataType: 'text',
			type: 'GET',
			data: { sending: sending, receiving: receiving, tobereceived: tobereceived, receivecurrency: receivecurrency, sendcurrency: sendcurrency },
			success: function(data) {
				console.log(data);
				array = data.split("xx");
				var payablenow=array[3];
				var rate=array[4];
				var sendcurrency=array[6];
				var receivecurrency=array[7];
				
				$('#rate').val(rate);
				$('#payablenow').val(payablenow);
				
				},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
				//bootbox.alert('<i class="fa fa-times font-red"></i> '+errorThrown);
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			beforeSend: function(){
				$(".proceedBtn").attr("disabled", true);
			},
			complete: function(){
				$(".proceedBtn").attr("disabled", false);
			}
		});
	});
	$$(".proceedBtn").on('click', function(e){
		e.preventDefault();
		var sending=$('#SendingBranch').val();
		var receiving=$('#ReceivingBranch').val();
		var tobereceived=$('#tobereceived').val();
		var payablenow=$('#payablenow').val();
		var receivecurrency=$('#rcurrency').val();
		var sendcurrency=$('#scurrency').val();
		
		localStorage.setItem("SendingBranch",sending);
		localStorage.setItem("ReceivingBranch",receiving);
		localStorage.setItem("tobereceived",tobereceived);
		localStorage.setItem("payablenow",payablenow);
		localStorage.setItem("receivecurrency",receivecurrency);
		localStorage.setItem("sendcurrency",sendcurrency);
		
		mainView.router.load({
			url: 'createtrans.html'
		});
	});
});

/*
|------------------------------------------------------------------------------
| Create Transaction
|------------------------------------------------------------------------------
*/

myApp.onPageInit('createtrans', function(page) {

	$('#tobereceived2').val(localStorage.getItem("tobereceived"));
	$('#payablenow2').val(localStorage.getItem("payablenow"));

});

/*
|------------------------------------------------------------------------------
| Log In
|------------------------------------------------------------------------------
*/

myApp.onPageInit('login', function(page) {
	console.log('login page');
	
	/* Show|Hide Password */
	$$('.page[data-page=login] [data-action=show-hide-password]').on('click', function() {
		if ($$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type') === 'password') {
			$$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type', 'text');
			$$(this).attr('title', 'Hide');
			$$(this).children('i').text('visibility_off');
		}
		else {
			$$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type', 'password');
			$$(this).attr('title', 'Show');
			$$(this).children('i').text('visibility');
		}
	});

	/* Validate & Submit Form */
	$('.page[data-page=login] form[name=login]').validate({
		rules: {
			username: {
				required: true,
      },
      password: {
				required: true
			}
		},
    messages: {
			email: {
				required: 'Please enter username.',
      },
			password: {
				required: 'Please enter password.'
      }
		},
		onkeyup: false,
    errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			var form = $("#loginForm");
			console.log('login btn clicked');
			console.log(form);
			
			//run Ajax script here
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/login.php",
				data: form.serialize(), // serializes the form's elements.
				success: function(data) {
					localStorage.setItem("token",data);
					$('.onlyloggedin').show();
					$('.onlyloggedout').hide();
					console.log("new token:"+data);
					mainView.loadPage('home.html');
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="3") {
						errormsg="Wrong login!";
					} else {
						errormsg="Connection Error!";
					}
					myApp.alert(errormsg);
				}
			});
			/*
			myApp.addNotification({
				message: 'Welcome',
				hold: 1500,
				button: {
					text: ''
				}
			});
			mainView.router.load({
				url: 'home.html'
			});
			*/
		}
	});

});

/*
|------------------------------------------------------------------------------
| Sign Up
|------------------------------------------------------------------------------
*/

myApp.onPageInit('signup', function(page) {

	/* Show|Hide Password */ 
	$$('.page[data-page=signup] [data-action=show-hide-password]').on('click', function() {
		if ($$('.page[data-page=signup]  input[data-toggle=show-hide-password]').attr('type') === 'password') {
			$$('.page[data-page=signup]  input[data-toggle=show-hide-password]').attr('type', 'text');
			$$(this).attr('title', 'Hide');
			$$(this).children('i').text('visibility_off');
		}
		else {
			$$('.page[data-page=signup] input[data-toggle=show-hide-password]').attr('type', 'password');
			$$(this).attr('title', 'Show');
			$$(this).children('i').text('visibility');
		}
	});

	/* Validate & Submit Form */
	$('.page[data-page=signup] form[name=signupForm]').validate({
		rules: {
			name: {
				required: true
			},
			email: {
				required: true,
				email:true
			},
			password: {
				required: true,
				minlength: 8
			}
		},
		messages: {
			name: {
				required: 'Please enter name.'
			},
			email: {
				required: 'Please enter email address.',
				email: 'Please enter a valid email address.'
			},
			password: {
				required: 'Please enter password.',
				minlength: 'Password must be at least 8 characters long.'
			}
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			var form = $("#signupForm");
			//run Ajax script here
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/signup.php",
				data: form.serialize(), // serializes the form's elements.
				success: function(data) {
					localStorage.setItem("token",data);
					$('.onlyloggedin').show();
					$('.onlyloggedout').hide();
					console.log("new token:"+data);
					mainView.loadPage('home.html');
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					myApp.alert(errormsg);
				}
			});
		}
	});

});	

/*
|------------------------------------------------------------------------------
| Forgot Password
|------------------------------------------------------------------------------
*/

myApp.onPageInit('forgot-password', function(page) {

	$('.page[data-page=forgot-password] form[name=forgot-password]').validate({
		rules: {
			email: {
				required: true,
        email:true
      }
		},
    messages: {
			email: {
				required: 'Please enter email address.',
        email: 'Please enter a valid email address.'
      }
		},
		onkeyup: false,
    errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			var form = $("#forgotForm");
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/resetpass.php",
				data: form.serialize(), // serializes the form's elements.
				success: function(data) {
					myApp.alert("Please check your email on file for new password");
					mainView.loadPage('home.html');
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					myApp.alert(errormsg);
				}
			});
		}
	});

});

/*
|------------------------------------------------------------------------------
| Splash Screen
|------------------------------------------------------------------------------
*/

myApp.onPageInit('splash-screen', function(page) {
	
		/* 3 seconds after logo animation is completed, open walkthrough screen. */
		setTimeout(function(){
			mainView.router.load({
				url: 'home.html'
			});
		}, 3000);

	/* 1 second after page is loaded, show preloader. */
	setTimeout(function() {
		$$('.page[data-page=splash-screen] .splash-preloader').css('opacity', 1);
	}, 1000);

});