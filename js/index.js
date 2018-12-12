(function($) {
    var _slotMachine,
    _indexObj = {};
	$(function() {
		init();
		setButton();
	});

	function init(){
        _slotMachine = new SlotMachine($('.slot-machine .s-l ul'), {callback:slotMachineCallback});
        $('#record .item-contnet').rollbar({pathPadding: '0px'});
        $('.slot-txt').pictureani({ frameWidth: 103, frameHeight: 104, fps: 5, totalFrames: 6, loop:true });
        /*TweenMax.delayedCall(1, function(){
            _slotMachine.stopAction(parseInt(Math.random() * 4));
        });*/
        initCreatejs();
        setMove();
        setForm();
	}

    function setMove(){
        var tl =  new TimelineLite({/*paused:true*/});
        tl.from($('.main .slot-machine, .main .slot-handle'), 1, {top:"+=300", autoAlpha:0});
        tl.staggerFrom($('.main .star-box li'), 1, {scale:0.2, left:420, top:200, autoAlpha:0, ease:Back.easeOut 
            , cycle:{ delay:function(){return parseInt(Math.random() * 2) / 10 + 0.1}}}
            , 0, "-=0.8");
        tl.from($('.light'), 1, { autoAlpha:0, ease:Linear.easeNone}, "-=0.5");
        tl.from($('.main .main-title'), 1, {top:"+=100", autoAlpha:0, ease:Back.easeOut}, "-=1");
        tl.staggerFrom($('.main .main-title div'), 0.7, {scale:2, autoAlpha:0, cycle:{ rotation:[-45, 45, -60]}, ease:Back.easeOut}, 0.2, "-=0.5");
        tl.from($('.main .txt'), 1, {top:"+=50", autoAlpha:0, ease:Back.easeOut}, "-=0.8");
        tl.from($('.main .notes'), 0.5, { autoAlpha:0, ease:Back.easeOut}, "-=0.5");
        tl.eventCallback("onComplete", moveEnd);
        TweenMax.to($('.light'), 20, {rotation:360, ease:Linear.easeNone, repeat:-1});
    }

	function setButton() {
		$('.slot-handle, .slot-txt').on('click', function(e) {
            e.preventDefault();
            gameStart();
            // if(_indexObj.login){
            //     gameStart();
            // }else{
            //     showMag("not login");
            // }
            
			//$('.slot-handle').addClass('active');
            // _slotMachine.stopAction(parseInt(Math.random() * 4));
		});

		$('#loginBtn, .login').on('click', function(e) {
            e.preventDefault();
            console.log('login');
            if(!_indexObj.login){
                // login();
                popupChange($('#login'), true);
            }else{
                checkLogin();
            }
			
		});

        $('#sendBtn a').on('click', function(e){
            e.preventDefault();
            console.log('form check');
            formCheck();
        });

        $('#signupBtn').on('click', function(e){
            e.preventDefault();
            
        });

		$('.notes-title').on('click', function(e) {
            e.preventDefault();
			$(this).addClass('active');
		});

        $('.notes-controller a').on('click', function(e) {
            e.preventDefault();
            
            if ( $('.notes-content').is(':hidden') ) {
                goToControllerArea();
            }

            $('.notes-content').slideToggle();
        });

        $('.nav-activity').on('click', function() {
            $('.notes-content').slideDown();
            goToControllerArea();
        });
        
        function goToControllerArea() {
            var notesControllerTop = $('.notes-controller').offset().top;
            $('html, body').animate({
                scrollTop: notesControllerTop + 10
            }, 800);
        }

		$('.external-link').on('click', function(e) {
			var link = $(this).attr('link'),
			goToLink = confirm('本公司無法繼續提供您連結至' + link + '後的隱私權保護，但本公司很誠摯地在此提醒您，當您離開本公司進入其他網站時，請別忘了先閱讀該網站所提供的隱私權條款，再決定您是否繼續接受該網站的服務。您確定開啟此連結？');
			if (goToLink) {
				window.open(link);
			}
		});
        
		$('.record-btn').on('click', function() {
            getAward();
		});

		$('.popup .pop-close-btn, .true-btn').on('click', function() {
			popupChange($('.popup'));
		});
	}

	function popupChange(pEle, pBol) {
        pBol = pBol || false;
		//$('body').css('overflow', 'hidden');
        if(pBol){
            Fun.eleFadeIn(pEle);
        }else{
            Fun.eleFadeOut(pEle);
        }
		
		//$('#record.popup').css('overflow-y', 'auto');
	}

    function moveEnd(){
        console.log("moveEnd");
        _indexObj.lightLength = $('.bulb-box.left div').length;
        titleLoop();
        lightLoop();
        TweenMax.ticker.fps(15);
        TweenMax.ticker.addEventListener("tick", update);
    }

    function titleLoop(){
        var tl =  new TimelineMax({repeat:-1});
        tl.staggerTo($('.main .main-title div'), 0.5, {scale:1.5, delay:2, ease:Back.easeIn}, 0.2);
        tl.staggerTo($('.main .main-title div'), 0.5, {scale:1, ease:Back.easeOut}, 0.2, "-=0.4");
    }

    function lightLoop(){
        _indexObj.lightNum = _indexObj.lightLength;
        _indexObj.lightBol = true;
    }

    function update(){
        if(_indexObj.lightBol){
            lightChange($('.bulb-box.left'), _indexObj.lightNum);
            lightChange($('.bulb-box.right'), _indexObj.lightNum);
            _indexObj.lightNum--;
            if(_indexObj.lightNum < -10){
                _indexObj.lightNum = _indexObj.lightLength;
            }
        }
        
    }

    function lightChange(pEle, pNum){
        pEle.children().each(function(i) {
            if(i < pNum - 1){
                $(this).removeClass('active');
            }else{
                $(this).addClass('active');
            }
        });
    }

    function lightFlash(){
        $('.bulb-box div').removeClass('active');
        TweenMax.to($('.bulb-box.left'), 0.3, { repeat:8, onRepeat:function(){
            $('.bulb-box div').toggleClass('active');
        }});
    }

    function gameStart(){
        if(_indexObj.gameBol) return;
        if(_indexObj.chanceNum == 0){
            window.alert('您已經沒有抽獎機會！')
            return;
        }
        _indexObj.gameBol = true;
        delete _indexObj.lightBol;
        lightFlash();
        Fun.eleFadeOut($('.slot-txt'));
        $('.slot-handle').addClass('active');
        TweenMax.delayedCall(0.2, function(){$('.slot-handle').removeClass('active')})
        getGift();
    }

    function gameWin(){
        lightFlash();
        
        //TweenMax.to($('goldBox'), 1, { repeat:1, onRepeat:addGroupGold, onComplete:gameEnd});
        exportRoot.play();
        if(_indexObj.winIconTMX){
            _indexObj.winIconTMX.restart();
        }else{
            _indexObj.winIconTMX = TweenMax.from($(".win-icon"), 1, {
                scale:2, 
                rotation:30,
                ease:Elastic.easeOut.config(1, 0.3),
                onStart:function(ele){ele.show();}, 
                onStartParams:[$(".win-icon")]
            });
        }
        
    }

    function gameEnd(){
        var ele = $('#fail');
        if(_indexObj.gift > 0){
            ele = $('#win');
            $(".win-icon").hide();
        }
        popupChange(ele, true);
        TweenMax.delayedCall(0.2, function(){_indexObj.lightBol = true; delete _indexObj.gameBol;})
        Fun.eleFadeIn($('.slot-txt'));
    }

    function addGroupGold(){
        var goldNum = 13;
        while(goldNum > 0){
            addGold();
            goldNum--;
        }
    }

    function addGold(){
        var ele = $('<div class="gold"></div>'), moveObj = {}, tl;
        moveObj.left = (parseInt(Math.random() * 11) - 5) * 100; 
        moveObj.top = parseInt(Math.random() * 11) * 5;
        //moveObj.top = parseInt(Math.random() * 10) * 5 - 25;
        moveObj.scale = parseInt(Math.random() * 5) / 10 + 0.8;
        moveObj.delay = parseInt(Math.random() * 11) / 10;
        tl = new TimelineLite({delay: moveObj.delay, onComplete:goldTLComplete, onCompleteParams:[ele]});
        $('.goldBox').append(ele);
        TweenMax.set(ele, {scale:0.1, alpha:0});
        tl.add([
            TweenMax.to(ele, 0.5, { scale:0.8, alpha:1}),
            TweenMax.to(ele, 0.5, {top:70, ease:Cubic.easeIn}),
            // TweenMax.to(ele, 0.8, {top:moveObj.top, ease:Circ.easeOut}),
            TweenMax.to(ele, 0.8, {top:moveObj.top, delay:0.5, ease:Circ.easeOut}),
            TweenMax.to(ele, 1.2, {left:moveObj.left, ease:Linear.easeNone}),
            // TweenMax.to(ele, 0.3, {alpha:0, delay:0.6, ease:Linear.easeNone})
        ]);
        tl.timeScale(1.8);
    }

    function goldTLComplete(pEle){
        pEle.remove();
    }

	function setForm(){
		Fun.setForm();
        $('#card_id').on('blur', function(e){
            $(this).val($(this).val().toUpperCase());
        });
	}

    function slotMachineCallback(){
        if(_indexObj.gift == 0){
            gameEnd();
        }else if(_indexObj.gift > 0){
            gameWin();
        }
    }

    function showMag(pStr){
        switch(pStr){
            case "not login":
                window.alert('您尚未登入！');
            break;

        }
    }

    function formCheck(){
        var cardID_check = /^[A-Z][0-9]{9,9}/;
        var inputCardID = $("input#card_id");
        if(!Fun.checkValueOfForm(inputCardID, cardID_check, "身分證字號格式錯誤")){ return false;}

        // var name_check  =/^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9_ ]*$/;
        // var inputName = $("input#name");
        // if(!Fun.checkValueOfForm(inputName)){ return false;}

        var inputPW = $("input#pw");
        inputPW.val(Fun.trim(inputPW.val()));
        if(inputPW.val() == ""){
            window.alert("請輸入密碼");
            return;
        }
        
        var inputCaptcha = $("input#captcha");
        if(!Fun.checkValueOfForm(inputCaptcha)){ return false;}
        var sendObj = {};
        sendObj.carID = inputCardID.val();
        // sendObj.name = inputName.val();
        sendObj.password = inputPW.val();
        sendObj.captcha = inputCaptcha.val();
        login(sendObj);
    }
	
    function checkLogin(pBol){
        pBol = pBol || false;
        var noticeEle = $('.notes'), loginBtn = $('#loginBtn');
        noticeEle.find('div').removeClass('active');
        if(pBol){
            popupChange($('#login'));
            noticeEle.find('.chance').addClass('active');
            loginBtn.addClass('login');
            _indexObj.login = true;
        }else{
            _indexObj.chanceNum = 0;
            noticeEle.find('.login').addClass('active');
            loginBtn.removeClass('login');
            delete _indexObj.login;
        }
        setChance();
    }

    function setChance(){
        $('.notes .chance a').html(_indexObj.chanceNum);
    }

    function setAward(pData){
        var ele = $('.item-contnet table');
        ele.html('');
        for(var setNum = 0; setNum < pData.length; setNum++){
            ele.append(renderAward(pData[setNum]));
        }
        popupChange($('#record'), true);
    }

    function renderAward(pData){
        var ele = ''
        + '<tr>'
        + '    <td style="width: 170px;">_date_</td>'
        + '    <td style="width: 130px;">_time_</td>'
        + '    <td style="width: 400px;">_gift_</td>'
        + '    <td style="width: 135px;">_sn_</td>'
        + '</tr>';
        ele = ele.replace('_date_', pData.date);
        ele = ele.replace('_time_', pData.time);
        ele = ele.replace('_gift_', pData.gift);
        ele = ele.replace('_sn_', pData.sn);
        return ele;
    }

    //createjs
    function initCreatejs(){
        canvas = document.getElementById("canvas");
        images = images||{};

        var manifest = [
            {src:"images/bg.jpg", id:"bg"},
            {src:"images/money_1.png", id:"money_1"},
            {src:"images/postition.jpg", id:"postition"}
        ];

        var loader = new createjs.LoadQueue(false);
        loader.addEventListener("fileload", handleFileLoad);
        loader.addEventListener("complete", handleComplete);
        loader.loadManifest(manifest);
    }

    function handleFileLoad(evt) {
        if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    function handleComplete() {
        exportRoot = new lib.money();

        stage = new createjs.Stage(canvas);
        stage.addChild(exportRoot);
        stage.update();

        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", stage);
    }

    window.createjs_aniEnd = function(){
        gameEnd();
    }  

	//============ data ============
	/*
	
	 */
    function login(pObj){
        /*Fun.loadingChange(true);
        $.post("登入API", pObj, function(data){
            Fun.loadingChange(false);
            if(data.result){
                _indexObj.chance = paserInt(data.chanceNum);
                checkLogin(true);
            }else{
                alert(data.msg);
            }
        }, 'json');*/
        
        _indexObj.chanceNum = 3;
        checkLogin(true);
    }

	/*
	
	 */
    function getGift(pObj){
        /*Fun.loadingChange(true);
        $.post("抽獎API", pObj, function(data){
            Fun.loadingChange(false);
            if(data.result){
                _slotMachine.startAction();
                _indexObj.gift = paserInt(data.gift);
                _indexObj.chanceNum = paserInt(data.chanceNum);
                _slotMachine.stopAction(_indexObj.gift - 1));
                setChance();
            }else{
                delete _indexObj.gameBol;
                alert(data.msg);
            }
        }, 'json');*/
        _indexObj.chanceNum--;
        _slotMachine.startAction();
        _indexObj.gift = parseInt(Math.random() * 6);
        _slotMachine.stopAction(_indexObj.gift);
        setChance();
    }

    /*
    
     */
    function getAward(pObj){
        /*Fun.loadingChange(true);
        $.post("抽獎記錄API", pObj, function(data){
            Fun.loadingChange(false);
            if(data.result){
                setAward(data.list);
            }else{
                alert(data.msg);
            }
        }, 'json');*/
        var data = {list:[]};
        data.list.push({date:"2016/10/12", time:"10:58", gift:"獲得普獎(優惠序號：ABCD12344)", sn:"2016101233"});
        data.list.push({date:"2016/11/12", time:"11:58", gift:"獲得普獎(優惠序號：ABCD12345)", sn:"4564531231"});
        data.list.push({date:"2016/10/11", time:"12:58", gift:"獲得普獎(優惠序號：ABCD12346)", sn:"4567872133"});
        data.list.push({date:"2016/01/02", time:"13:58", gift:"獲得普獎(優惠序號：ABCD12347)", sn:"1237784512"});
        data.list.push({date:"2016/12/12", time:"14:58", gift:"獲得普獎(優惠序號：ABCD12348)", sn:"1237787823"});
        data.list.push({date:"2016/10/05", time:"15:58", gift:"獲得普獎(優惠序號：ABCD12349)", sn:"1234578666"});
        data.list.push({date:"2016/10/07", time:"16:58", gift:"獲得普獎(優惠序號：ABCD12340)", sn:"1234784554"});
        setAward(data.list);
    }

})(jQuery);
var canvas, stage, exportRoot;