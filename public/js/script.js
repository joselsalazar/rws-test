function getXMLHttp()
{
    if (window.XMLHttpRequest)
    {
        // code for IE7+, Firefox, Chrome, Opera, Safari
          return new XMLHttpRequest();
    }
    else
    {
        // code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}


function rwsAddRandom(url)
{
	if ( url.indexOf('?') == -1 )
		url = url + '?random='+Math.random();
	else
		url = url + '&random='+Math.random();

	return url;
}

function rwsAJAXPostAJAX(url,params,async,onResponse,pass_to_response)
{
	function foo(response_text, pass_to_response)
	{
		var response_object = eval('('+response_text+')');
		onResponse(response_object,pass_to_response);
	};

	rwsAJAXPost(url,params,async,foo,pass_to_response);
}

function rwsAJAXPostAJAXWithWaitFade(url,params,result_handler,pass_to_response)
{
	hideFade();
	showWaitFade(function(){hideFade()});

	function wrap( response, passed_to_response )
	{
		hideFade();
		result_handler(response, passed_to_response);
	}

	rwsAJAXPostAJAX(url,params,true,wrap,pass_to_response);
}

function rwsAJAXPostAJAXWithWaitFadeAndCustomMessage(url,params,result_handler, message_on_wait_fade,pass_to_response)
{
    rwsAJAXPostAJAXWithWaitFadeAndCustomMessage(url,params,result_handler, message_on_wait_fade,pass_to_response, true);
}

function rwsAJAXPostAJAXWithWaitFadeAndCustomMessage(url,params,result_handler, message_on_wait_fade,pass_to_response, can_cancel)
{
	hideFade();

	showWaitFadeWithCustomMessage(can_cancel == false ? null : function(){hideFade()}, message_on_wait_fade);

	function wrap( response, passed_to_response )
	{
		hideFade();
		result_handler(response, passed_to_response);
	}

	rwsAJAXPostAJAX(url,params,true,wrap,pass_to_response);
}

function rwsAJAXPostFormAJAXWithWaitFade(url, form_data, onResponse, pass_to_response)
{
    hideFade();
    showWaitFade(function(){hideFade()});

    var xhr = new XMLHttpRequest();
    xhr.open('POST', rwsAddRandom(url), true);

    xhr.onreadystatechange=function()
    {
        if (xhr.readyState==4 && xhr.status==200)
        {
            hideFade();

            if (! onResponse) return void(0);

            var response_text = xhr.responseText;
            var response_object = eval('('+response_text+')');

            onResponse(response_object, pass_to_response);

            return void(0);
        }
    }

    xhr.send(form_data);
}

function rwsAJAXPost(url,params,async,onResponse,pass_to_response)
{
	if ( url.indexOf('/front-end-dev-skills-test/accounts/get') >= 0 )
	{
		var json_response = '{"title":"JimNET","login_scheme":{"scheme":"AJAX","is_valid":true,"number_of_accounts":10},"access_date":"12/18/2017","credentials":[{"username":"talisha.rose","password":"peanutButter"},{"username":"jess.swanson","password":"idunno"},{"username":"sal.salazar","password":"112345"},{"username":"jon.toy","password":"MyPASSwoRd6692"},{"username":"christina.draize"},{"username":"bobross85032","password":"bobross85032","password2":"happylittlemistake"},{"username":"invalidcharacters","password":"33# #3"},{"username":"jon.toy","password":"otherPassword"},{"username":"blankspace","password":""},{}]}';
		
		onResponse(json_response, pass_to_response);
	}
	
	return void(0);
}

 function isFadeVisible()
 {
	 var fade_el = document.getElementById('dialog_fade');
	 if ( fade_el == null ) return false;

	 console.log(fade_el.style.display);

	 if ( fade_el.style.display.equalsIgnoreCase('none') || fade_el.style.display.equalsIgnoreCase('') )
		 return false;

	 return true;
 }

 function showWaitFade(cancel_func)
 {
	 var fade_el = document.getElementById('dialog_fade');
	 fade_el.innerHTML = '';

	 var content = createElement('div',{'style':'position: absolute; text-align: center;'});

	 var img = createElement('img',{'src':'/images/ajax-loader.gif'});
	 content.appendChild(img);

	 if ( cancel_func != null  )
	 {
		 content.appendChild(createElement('br'));
		 content.appendChild(createElement('br'));

		 var cancel_link = createElement('a',{'class':'syn_link', 'style':'color: #A5A4A4'}, 'Cancel');
		 cancel_link.onclick = cancel_func;
		 content.appendChild(cancel_link);
	 }


	 fade_el.appendChild(content);

	 doShowFade.center_stuff = content;
	 doShowFade();
 }
 
 function showWaitFadeWithCustomMessage(cancel_func, custom_message)
 {
	 var fade_el = document.getElementById('dialog_fade');
	 fade_el.innerHTML = '';

	 var content = createElement('div',{'style':'position: relative; text-align: center;'});

	 if ( custom_message != null  )
	 {
	     var custom_message = createElement('a',{'style':'color: #A5A4A4', 'id':'custom-ajax-loading-message'}, '<b> ' +custom_message + '</b>');
	     content.appendChild(custom_message);
	 
	     content.appendChild(createElement('br'));
	     content.appendChild(createElement('br'));
	 }
	 
	 var img = createElement('img',{'src':'/images/ajax-loader.gif'});
	 content.appendChild(img);

	 if ( cancel_func != null  )
	 {
		 content.appendChild(createElement('br'));
		 content.appendChild(createElement('br'));

		 var cancel_link = createElement('a',{'class':'syn_link', 'style':'color: #A5A4A4'}, 'Cancel');
		 cancel_link.onclick = cancel_func;
		 content.appendChild(cancel_link);
	 }


	 fade_el.appendChild(content);

	 doShowFade.center_stuff = content;
	 doShowFade();
 }

 function showTimeDelayFade(message, how_long_in_millis, on_done)
 {
	 if ( how_long_in_millis == null )
		 throw new Error('You must specify a time period');

	 var fade_el = document.getElementById('dialog_fade');
	 fade_el.innerHTML = '';

	 var table = createElement('table',{'style':'width: 100%; height: 100%'});
	 var tr = createElement('tr');
	 var td = createElement('td',{'style':'text-align: center;'});

	 var progress = createElement('progress',{'value':0,'max':100,'style':'width: 200px'});
	 td.appendChild(progress);

	 var start_time = new Date().getTime();

	 function myTimerFunc()
	 {
		 var cur_time = new Date().getTime();

		 if ( cur_time > start_time + how_long_in_millis )
		 {
			 hideFade();
			 clearInterval(my_timer);

			 if ( on_done != null )
				 on_done();
			 return;
		 }

		 var val = 100*(cur_time-start_time)/how_long_in_millis;
		 progress.value = val;
	 }

	 var my_timer = setInterval(myTimerFunc, 100);

	 var msg_div = createElement('div',{'style':'padding-top:5px;'},message);
	 td.appendChild(msg_div);

	 tr.appendChild(td);
	 table.appendChild(tr);

	 fade_el.appendChild(table);

	 doShowFade();
 }

function showFade()
 {
	 var fade_el = document.getElementById('dialog_fade');
	 fade_el.innerHTML = '&nbsp;';

	 doShowFade();

	 // ok, this is a bit weird, but when a dialog box is being shown, it
		// will often *lengthen* the page. To correct for this "page
		// lengthening" the size of the overly needs to be updated after short
		// (1/4 second) span...
	 setTimeout(function(){doShowFade();},250);
 }

 function doShowFade()
 {
	 var fade_el = document.getElementById('dialog_fade');

 	if ( fade_el )
 	{
 		var height = '100%';

 		if ( document.body.scrollHeight && document.documentElement.clientHeight )
 		{
 			var max_height = document.body.scrollHeight;
 			if ( max_height < document.documentElement.clientHeight )
 				max_height = document.documentElement.clientHeight;

 			height = max_height+"px";

 			fade_el.style.height = height;
 		}

 		document.getElementById('dialog_fade').style.display = 'block';
 	}


 	if ( doShowFade.center_stuff )
 	{
 		window.onscroll = function()
 		{
	 		var rect = doShowFade.center_stuff.getBoundingClientRect();

	 		var cx = window.pageXOffset+document.documentElement.clientWidth/2;
	 		var cy = window.pageYOffset+document.documentElement.clientHeight/2;

	 		cx -= rect.width/2;
	 		cy -= rect.height/2;

	 		doShowFade.center_stuff.style.left = cx+'px';
	 		doShowFade.center_stuff.style.top = cy+'px';
 		}
 		window.onscroll();
 	}

 	window.onresize = doShowFade;
 }

 function createGlassPane(zindex)
 {
	 var style = 'position: absolute; top: 0%; left: 0%; width: 100%; height: 100%; opacity: 0.0;';

	 if ( zindex != null )
		 style += ' z-index: '+zindex+';';

	 var div = createElement('div',{'style':style});
	 document.body.appendChild(div);
	 return div;
 }



 function hideFade()
 {
	 document.getElementById('dialog_fade').style.display = 'none';
	 window.onresize = null;
	 doShowFade.center_stuff = null;
	 window.onscroll = null;
 }
 
 function createElement(tag_name, attributes, innerHTML)
{
	var element = document.createElement(tag_name);

	setAttributes(element,attributes);

	if ( innerHTML )
	{
		element.innerHTML = innerHTML;
	}

	return element;
}

function setAttributes(element, attributes)
{
	if ( element == null || attributes == null)
		return;

	for (var key in attributes)
	{
	    if (!attributes.hasOwnProperty(key)) continue;

	    var value = attributes[key];

	    if ( typeof value == "function" )
	    	element[key] = value;
	    else
	    	element.setAttribute(key,value);

	}
}

function getAllSubElements(element)
{
	var ret = [element];

	if ( element.children == null ) return ret;

	for ( var i = 0; i < element.children.length; i++ )
	{
		ret = ret.concat(getAllSubElements(element.children[i]));
	}

	return ret;
}