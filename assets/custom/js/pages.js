'use strict';


/*
|------------------------------------------------------------------------------
| Get user info
|------------------------------------------------------------------------------
*/
myApp.onPageInit('*', function(page) {
	$('.mchip').hide();
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'savedtoken=' + savedtoken;
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
			   
			   if (obj[0].newmessages!=0) {
				  $('.mchip').show();
				  $('.messagescount').html(obj[0].newmessages);
			   }
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				} else if (errormsg=="1") { // banned
					localStorage.removeItem("token");
					$('.onlyloggedin').hide();
					$('.onlyloggedout').show();
					$('.name').text("");
					$('.username').text("");
					console.log('logged out');
					mainView.loadPage('home.html');
					
					errormsg="You account has been deactivated, please contact admin";
				} else if (errorms==2) { // wrong token
					localStorage.removeItem("token");
					$('.onlyloggedin').hide();
					$('.onlyloggedout').show();
					$('.name').text("");
					$('.username').text("");
					console.log('logged out');
					mainView.loadPage('home.html');
					
					errormsg="Wrong token!";
				}
				
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
		$('.onlyloggedin').show();
		$('.onlyloggedout').hide();
	} else {
		$('.onlyloggedin').hide();
		$('.onlyloggedout').show();
		$('.myname').text("");
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
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
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
			if (errormsg=="" || errormsg==undefined) {
				errormsg="Connection Error";
			}
			var toast = myApp.toast(errormsg);
			toast.show();
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
				}
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
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
				}
				$('#payablenow').val('');
				$('#tobereceived').val('');
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
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
	setTimeout(function(){
		$('#payablenow').on('input', function() {
			var sending=$('#SendingBranch').val();
			var receiving=$('#ReceivingBranch').val();
			var payablenow=$('#payablenow').val();
			var receivecurrency=$('#rcurrency').val();
			var sendcurrency=$('#scurrency').val();
			if (!isNaN(payablenow)) {
				$.ajax({
					beforeSend: function() { myApp.showIndicator(); },
					complete: function(){ myApp.hideIndicator(); },
					url: 'http://webhosting.sd/sawi/php/reverse.php',
					dataType: 'text',
					type: 'GET',
					data: { sending: sending, receiving: receiving, payablenow: payablenow, receivecurrency: receivecurrency, sendcurrency: sendcurrency },
					success: function(data) {
						var array = data.split("xx");
						var amount=array[2];
						localStorage.setItem("amount",amount);
						var tobereceived=array[3];
						var rate=array[4];
						
						if ($('#payablenow').val()!="") {
							$('#tobereceived').val(tobereceived);
							$('#rate').val(rate);
						}
						
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
						var toast = myApp.toast(errormsg);
						toast.show();
					
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
			} else {
				$('#tobereceived').val('');
				$('#payablenow').val('');
			}
		});
	},500);

	// reverse receive - tobereceived
	setTimeout(function(){
		$('#tobereceived').on('input', function() {
			var sending=$('#SendingBranch').val();
			var receiving=$('#ReceivingBranch').val();
			var tobereceived=$('#tobereceived').val();
			var receivecurrency=$('#rcurrency').val();
			var sendcurrency=$('#scurrency').val();
			
			if (!isNaN(tobereceived)) {
				$.ajax({
					url: 'http://webhosting.sd/sawi/php/reversereceive.php',
					dataType: 'text',
					type: 'GET',
					data: { sending: sending, receiving: receiving, tobereceived: tobereceived, receivecurrency: receivecurrency, sendcurrency: sendcurrency },
					success: function(data) {
						var array = data.split("xx");
						var amount=array[2];
						localStorage.setItem("amount",amount);
						var payablenow=array[3];
						var rate=array[4];
						var sendcurrency=array[6];
						var receivecurrency=array[7];
						
						if ($('#tobereceived').val()!="") {
							$('#rate').val(rate);
							$('#payablenow').val(payablenow);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
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
			} else {
				$('#tobereceived').val('');
				$('#payablenow').val('');
			}
		});
	},500);
	
	$$(".proceedBtn").on('click', function(e){
		e.preventDefault();
		var sending=$('#SendingBranch').val();
		var receiving=$('#ReceivingBranch').val();
		var sendingname=$('#SendingBranch').text();
		var receivingname=$('#ReceivingBranch').text();
		var tobereceived=$('#tobereceived').val();
		var payablenow=$('#payablenow').val();
		var receivecurrency=$('#rcurrency').val();
		var sendcurrency=$('#scurrency').val();
		
		// get selected options
		//var selsen = $('#SendingBranch');
		//var selrec = $('#ReceivingBranch');
		//var sendingname= selsen.options[selsen.selectedIndex].text;
		//var receivingname= selrec.options[selrec.selectedIndex].text;
		
		var sendingname= $("#SendingBranch option:selected").text();
		var receivingname= $("#ReceivingBranch option:selected").text();
		
		if (tobereceived!="" && payablenow!="") {
			localStorage.setItem("SendingBranch",sending);
			localStorage.setItem("ReceivingBranch",receiving);
			localStorage.setItem("SendingBranchName",sendingname);
			localStorage.setItem("ReceivingBranchName",receivingname);
			localStorage.setItem("tobereceived",tobereceived);
			localStorage.setItem("payablenow",payablenow);
			localStorage.setItem("receivecurrency",receivecurrency);
			localStorage.setItem("sendcurrency",sendcurrency);
			
			mainView.router.load({
				url: 'createtrans.html'
			});
		} else {
			var toast = myApp.toast('<i class="fa fa-times"></i> Please enter valid amounts');
			toast.show();
		}
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
	$('.rcurrency').html(localStorage.getItem("receivecurrency"));
	$('.scurrency').html(localStorage.getItem("sendcurrency"));
	$('.sendingdiv').text(localStorage.getItem("SendingBranchName"));
	$('.receivingdiv').text(localStorage.getItem("ReceivingBranchName"));

	// reverse - payable now
	setTimeout(function(){
		$('#payablenow2').on('input', function() {
			var sending=localStorage.getItem("SendingBranch");
			var receiving=localStorage.getItem("ReceivingBranch");
			var payablenow=$('#payablenow2').val();
			var receivecurrency=localStorage.getItem("receivecurrency");
			var sendcurrency=localStorage.getItem("sendcurrency");
			var payment=$('#payment').val();
			var settlement=$('#settlement').val();
			if (!isNaN(payablenow)) {
				$.ajax({
					beforeSend: function() { myApp.showIndicator(); },
					complete: function(){ myApp.hideIndicator(); },
					url: 'http://webhosting.sd/sawi/php/reverse.php',
					dataType: 'text',
					type: 'GET',
					data: { sending: sending, receiving: receiving, payablenow: payablenow, receivecurrency: receivecurrency, sendcurrency: sendcurrency, payment: payment, settlement: settlement },
					success: function(data) {
						var array = data.split("xx");
						var amount=array[2];
						localStorage.setItem("amount",amount);
						var tobereceived=array[3];
						var rate=array[4];
						
						if ($('#payablenow2').val()!="") {
							$('#tobereceived2').val(tobereceived);
							$('#rate').val(rate);
						}
						
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
						
						$('#payablenow2').val('');
						$('#tobereceived2').val('');
					},
					beforeSend: function(){
						$(".submitTransBtn").attr("disabled", true);
					},
					complete: function(){
						$(".submitTransBtn").attr("disabled", false);
					}
				});
			} else {
				$('#tobereceived2').val('');
				$('#payablenow2').val('');
			}
		});
	},500);

	// reverse receive - tobereceived
	setTimeout(function(){
		$('#tobereceived2').on('input', function() {
			var sending=localStorage.getItem("SendingBranch");
			var receiving=localStorage.getItem("ReceivingBranch");
			var tobereceived=$('#tobereceived2').val();
			var receivecurrency=localStorage.getItem("receivecurrency");
			var sendcurrency=localStorage.getItem("sendcurrency");
			var payment=$('#payment').val();
			var settlement=$('#settlement').val();
			
			if (!isNaN(tobereceived)) {
				$.ajax({
					url: 'http://webhosting.sd/sawi/php/reversereceive.php',
					dataType: 'text',
					type: 'GET',
					data: { sending: sending, receiving: receiving, tobereceived: tobereceived, receivecurrency: receivecurrency, sendcurrency: sendcurrency, payment: payment, settlement: settlement },
					success: function(data) {
						var array = data.split("xx");
						var amount=array[2];
						localStorage.setItem("amount",amount);
						var payablenow=array[3];
						var rate=array[4];
						var sendcurrency=array[6];
						var receivecurrency=array[7];
						
						if ($('#tobereceived2').val()!="") {
							$('#rate').val(rate);
							$('#payablenow2').val(payablenow);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
						
						$('#payablenow2').val('');
						$('#tobereceived2').val('');
					},
					beforeSend: function(){
						$(".submitTransBtn").attr("disabled", true);
					},
					complete: function(){
						$(".submitTransBtn").attr("disabled", false);
					}
				});
			} else {
				$('#tobereceived2').val('');
				$('#payablenow2').val('');
			}
		});
	},500);
	
	// payment, settlement
	setTimeout(function(){
		$('#payment, #settlement').on('change', function() {		
			var sending=localStorage.getItem("SendingBranch");
			var receiving=localStorage.getItem("ReceivingBranch");
			var tobereceived=$('#tobereceived2').val();
			var receivecurrency=localStorage.getItem("receivecurrency");
			var sendcurrency=localStorage.getItem("sendcurrency");
			var payment=$('#payment').val();
			var settlement=$('#settlement').val();
			var amount=localStorage.getItem("amount");
			
			$.ajax({
				url: 'http://webhosting.sd/sawi/php/forward.php',
				dataType: 'text',
				type: 'GET',
				data: { sending: sending, receiving: receiving, payment: payment, settlement: settlement, amount: amount, receivecurrency: receivecurrency, sendcurrency: sendcurrency },
				success: function(data) {
					var array = data.split("xx");
					var payablenow=array[2];
					var tobereceived=array[3];

					$('#payablenow2').val(payablenow);
					$('#tobereceived2').val(tobereceived);
					
					},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
						var toast = myApp.toast(errormsg);
						toast.show();
				},
				beforeSend: function(){
					$(".submitTransBtn").attr("disabled", true);
				},
				complete: function(){
					$(".submitTransBtn").attr("disabled", false);
				}
			});
		});
	},500);
	
	$$(".submitTransBtn").on('click', function(e){
		e.preventDefault();
		if (localStorage.getItem("token") !== null) {
			var form = $("#submitTransForm");
			//submit transaction
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/addtrans.php?amount="+localStorage.getItem('amount')+"&token="+localStorage.getItem("token")+"&sending="+localStorage.getItem("SendingBranch")+"&receiving="+localStorage.getItem("ReceivingBranch")+"&sendcurrency="+localStorage.getItem("sendcurrency")+"&receivecurrency="+localStorage.getItem("receivecurrency"),
				data: form.serialize(), // serializes the form's elements.
				success: function(data) {
					localStorage.removeItem("SendingBranch"); // end ongoing transaction
					var toast = myApp.toast('<i class="fa fa-check"></i> Transaction Submitted!');
					toast.show();
					mainView.router.load({
						url: 'transactions.html'
					});
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="" || errormsg==undefined) {
						errormsg="Connection Error";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
				}
			});
			
		} else {
			mainView.router.load({
				url: 'signup.html'
			});
		}
	});
});

/*
|------------------------------------------------------------------------------
| Transaction Payments
|------------------------------------------------------------------------------
*/

myApp.onPageInit('transpayments', function(page) {
	var getid = page.query.id;
	var href="addpayment.html?id="+getid;
	$('#addpayment').attr("href", href);
	$('#addpayment').hide();
	
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken + '&id=' + getid;
		window.htmlText="";
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/transpayments.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				console.log(data);
				$('.transcode').html(data[0].transcode);
				$.each(data, function(i, field){
					if (i>0) { // skip first row
						htmlText += '<tr>';
						htmlText += '<td class="numeric-cell">'+data[i].sendcurrency+' '+data[i].amount+'</td>';
						htmlText += '<td class="numeric-cell">'+data[i].paymentinfo+'</td>';
						htmlText += '<td class="numeric-cell">'+data[i].created+'</td>';
						htmlText += '<td class="numeric-cell">'+data[i].createdby+'</td>';
						htmlText += '<td class="numeric-cell">'+data[i].approved+'</td>';
						htmlText += '</tr>';
						$('#paymentslist').append(htmlText);
						htmlText='';
					}
				});

				if (data[0].tapproved!=2) { // not rejected
					$("#addpayment").show();
				}				
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
});

/*
|------------------------------------------------------------------------------
| Add Payment
|------------------------------------------------------------------------------
*/

myApp.onPageInit('addpayment', function(page) {
	var getid = page.query.id;
	
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken + '&id=' + getid;
		console.log(getid);
		window.htmlText="";
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/transdetails.php",
			data: dataString, // send token to grab data
			success: function(data) {
				console.log(data);
				var data = JSON.parse(data);
				$('.transcode').html(data[0].code);
				$('.scurrency').html(data[0].sendcurrency);
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}

	$$(".addPaymentBtn").on('click', function(e){
		e.preventDefault();
		if (localStorage.getItem("token") !== null) {
			var savedtoken = localStorage.getItem("token");
			
			var form = $("#addPaymentForm");
			var paymentamount=$('#paymentamount').val();
			//submit
			if (!isNaN(paymentamount)) {
				$.ajax({
					beforeSend: function() { myApp.showIndicator(); },
					complete: function(){ myApp.hideIndicator(); },
					type: "GET",
					url: "http://webhosting.sd/sawi/php/addpayment.php?token=" + savedtoken + "&id=" + getid,
					data: form.serialize(), // serializes the form's elements.
					success: function(data) {
						var toast = myApp.toast('<i class="fa fa-check"></i> Payment Added!');
						toast.show();
						mainView.router.load({
							url: 'transpayments.html?id='+getid
						});
					},
					error:function(XMLHttpRequest,textStatus,errorThrown){
						var errormsg=XMLHttpRequest.responseText;
						if (errormsg=="" || errormsg==undefined) {
							errormsg="Connection Error";
						}
						var toast = myApp.toast(errormsg);
						toast.show();
					}
				});
			} else {
				$('#paymentamount').val('');
			}
			
		} else {
			mainView.router.load({
				url: 'signup.html'
			});
		}
	});
});

/*
|------------------------------------------------------------------------------
| Balance
|------------------------------------------------------------------------------
*/

myApp.onPageInit('balance', function(page) {
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken;
		window.htmlText="";
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/balance.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				$.each(data, function(i, field){
					htmlText += '<tr>';
					htmlText += '<td class="numeric-cell">'+data[i].code+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].rname+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].sendcurrency+' '+data[i].payablenow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].created+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].sendcurrency+' '+data[i].owes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>';
					htmlText += '<td class="numeric-cell"><a href="transdetails.html?id='+data[i].id+'">Details</a></td>';
					htmlText += '</tr>';
					$('#translist').append(htmlText);
					htmlText='';
				});
				
				if (data.length==0) {
					var toast = myApp.toast('<i class="fa fa-times"></i> Nothing to show here');
					toast.show();
				}
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
});

/*
|------------------------------------------------------------------------------
| Transactions
|------------------------------------------------------------------------------
*/

myApp.onPageInit('transactions', function(page) {
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken;
		window.htmlText="";
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/transactions2.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				$.each(data, function(i, field){
					htmlText += '<tr>';
					htmlText += '<td class="numeric-cell">'+data[i].rname+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].sendcurrency+' '+data[i].payablenow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].approvedtext+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].settledtext+'</td>';
					htmlText += '<td class="numeric-cell">'+data[i].created+'</td>';
					htmlText += '<td class="numeric-cell"><a href="transdetails.html?id='+data[i].id+'">Details</a></td>';
					htmlText += '<td class="numeric-cell"><a class="button button-fill color-teal" href="transpayments.html?id='+data[i].id+'">Payments</a></td>';
					htmlText += '</tr>';
					$('#translist').append(htmlText);
					htmlText='';
				});
				
				if (data.length==0) {
					var toast = myApp.toast('<i class="fa fa-times"></i> Nothing to show here');
					toast.show();
				}
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
});

/*
|------------------------------------------------------------------------------
| Transactions Details
|------------------------------------------------------------------------------
*/

myApp.onPageInit('transdetails', function(page) {
	var getid = page.query.id;
	$('.notsettled').hide();
	$('.settled').hide();
	
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken + '&id=' + getid;
		var href="edittrans.html?id="+getid;
		$('#edittranslik').attr("href", href);
		
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/transdetails.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				$('#rname3').html(data[0].rname);
				$('#rnationality3').html(data[0].rnationality);
				$('#raddress3').html(data[0].raddress);
				$('#rphone13').html(data[0].rphone1);
				$('#rphone23').html(data[0].rphone2);
				$('#transactioncode3').html(data[0].code);
				$('#sbranchname3').html(data[0].sbranchname);
				$('#payablenow3').html(data[0].sendcurrency+' '+data[0].payablenow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				$('#rbranchname3').html(data[0].rbranchname);
				$('#tobereceived3').html(data[0].receivecurrency+' '+data[0].tobereceived.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				$('#notes3').html(data[0].notes);
				$('#created3').html(data[0].created);
				$('#notes3').html(data[0].notes);
				$('#createdby3').html(data[0].createdby);
				$('#paidstatustext3').html(data[0].paidstatustext);
				$('#approvedtext3').html(data[0].approvedtext);
				$('#settledtext3').html(data[0].settledtext);
				
				if (data[0].settled==0) { // not settled, not rejected
					$('.notsettled').show();
					$('.settled').hide();
				} else { // if settled or rejected, show linkless button
					$('.notsettled').hide();
					$('.settled').show();
				}
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
});

/*
|------------------------------------------------------------------------------
| Edit Transactions
|------------------------------------------------------------------------------
*/

myApp.onPageInit('edittrans', function(page) {
	var getid = page.query.id;
	$('.canceltrans').hide();
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken + '&id=' + getid;
		
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/transdetails.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				$('#rname4').val(data[0].rname);
				$('#rnationality4').val(data[0].rnationality);
				$('#raddress4').val(data[0].raddress);
				$('#rphone14').val(data[0].rphone1);
				$('#rphone24').val(data[0].rphone2);
				$('#notes4').val(data[0].notes);
				
				$('#transactioncode4').html(data[0].code);
				$('#sbranchname4').html(data[0].sbranchname);
				$('#payablenow4').html(data[0].sendcurrency+' '+data[0].payablenow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				$('#rbranchname4').html(data[0].rbranchname);
				$('#tobereceived4').html(data[0].receivecurrency+' '+data[0].tobereceived.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				
				console.log(data[0].settled+'xx'+data[0].approved)
				if (data[0].settled==0 && data[0].approved!=2) { // not settled and not rejected
					// show the cancel icon
					$('.canceltrans').show();
				}
				
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
	
	$$(".editTransBtn").on('click', function(e){
		e.preventDefault();
		if (localStorage.getItem("token") !== null) {
			var form = $("#editTransForm");
			//submit transaction
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/edittrans.php?transid="+getid+"&token="+localStorage.getItem('token'),
				data: form.serialize(), // serializes the form's elements.
				success: function(data) {
					var toast = myApp.toast('<i class="fa fa-check"></i> Transaction Edited!');
					toast.show();
					mainView.router.load({
						url: 'transdetails.html?id='+getid
					});
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="" || errormsg==undefined) {
						errormsg="Connection Error";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
				}
			});
			
		} else {
			mainView.router.load({
				url: 'signup.html'
			});
		}
	});
	
	$$(".canceltrans").on('click', function(e){
		e.preventDefault();
		if (localStorage.getItem("token") !== null) {
			//submit transaction
			$.ajax({
				beforeSend: function() { myApp.showIndicator(); },
				complete: function(){ myApp.hideIndicator(); },
				type: "GET",
				url: "http://webhosting.sd/sawi/php/canceltrans.php?transid="+getid+"&token="+localStorage.getItem('token'),
				success: function(data) {
					var toast = myApp.toast('<i class="fa fa-check"></i> Transaction Cancelled!');
					toast.show();
					mainView.router.load({
						url: 'transdetails.html?id='+getid
					});
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="" || errormsg==undefined) {
						errormsg="Connection Error";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
				}
			});
			
		} else {
			mainView.router.load({
				url: 'signup.html'
			});
		}
	});
});

/*
|------------------------------------------------------------------------------
| Messages
|------------------------------------------------------------------------------
*/

myApp.onPageInit('messages', function(page) {
	if (localStorage.getItem("token") !== null) {
		var savedtoken = localStorage.getItem("token");
		var dataString = 'token=' + savedtoken;
		window.htmlText="";
		// get user id
		$.ajax({
			beforeSend: function() { myApp.showIndicator(); },
			complete: function(){ myApp.hideIndicator(); },
			type: "GET",
			url: "http://webhosting.sd/sawi/php/messages.php",
			data: dataString, // send token to grab data
			success: function(data) {
				var data = JSON.parse(data);
				$.each(data, function(i, field){
					htmlText += '<li class="item-content">';
					htmlText += '<div class="item-inner">';
					htmlText += '<div class="item-title-row">';
					htmlText += '<div class="item-title">'+data[i].text+'</div>';
					htmlText += '</div>';
					htmlText += '<div class="item-subtitle">'+data[i].date+'</div>';
					htmlText += '</div>';
					htmlText += '</li>';

					$('#messages').append(htmlText);
					htmlText='';
				});
				if (data.length==0) {
					var toast = myApp.toast('<i class="fa fa-times"></i> Nothing to show here');
				toast.show();
				}				
			},
			error:function(XMLHttpRequest,textStatus,errorThrown){
				var errormsg=XMLHttpRequest.responseText;
				if (errormsg=="" || errormsg==undefined) {
					errormsg="Connection Error";
				}
				var toast = myApp.toast(errormsg);
				toast.show();
			}
		});
	} else {
		mainView.loadPage('home.html');
	}
});

/*
|------------------------------------------------------------------------------
| Log In
|------------------------------------------------------------------------------
*/

myApp.onPageInit('login', function(page) {
	
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
					if (localStorage.getItem("SendingBranch") !== null) { // there is an ongoing transaction
						mainView.loadPage('createtrans.html');
					} else {
						mainView.loadPage('home.html');
					}
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="3") {
						errormsg="Wrong login!";
					} else {
						errormsg="Connection Error!";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
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
					if (localStorage.getItem("SendingBranch") !== null) { // there is an ongoing transaction
						mainView.loadPage('createtrans.html');
					} else {
						mainView.loadPage('home.html');
					}
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="" || errormsg==undefined) {
						errormsg="Connection Error";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
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
					var toast = myApp.toast('<i class="fa fa-check"></i> Please check your email on file for new password');
					toast.show();
					mainView.loadPage('home.html');
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					var errormsg=XMLHttpRequest.responseText;
					if (errormsg=="" || errormsg==undefined) {
						errormsg="Connection Error";
					}
					var toast = myApp.toast(errormsg);
					toast.show();
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