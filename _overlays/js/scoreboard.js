window.onload = init;

function init() {
    var streamJSON = '../sc/streamcontrol.json';
    var scObj;
    var startup = true;
    var animated = false;
    var game;
    var p1Wrap = $('#p1Wrapper');
    var p2Wrap = $('#p2Wrapper');
    var p3Wrap = $('#p3Wrapper');
    var p4Wrap = $('#p4Wrapper');
    var rdResize = $('#round');
	

    // Thanks internets:
    // https://dev.to/jorik/country-code-to-flag-emoji-a21
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return "";
        // Only allow A-Z
        if (!/^[A-Za-z]{2}$/.test(countryCode)) return "";
        const codePoints = countryCode
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    function drawDiffToDOM(diff) {
    diff.forEach(({ key, value: newValue }) => {
        let updateFunc;

        // Controllers
        if (
            key === "p1Controller" ||
            key === "p2Controller" ||
            key === "p3Controller" ||
            key === "p4Controller"
        ) {
            updateFunc = () => {
                const player = key.slice(0, 2).toLowerCase(); // "p1", "p2", etc.
                const section = document.querySelector(`.${player}controller-display`);
                if (!section) return;

                // Remove old controller classes
                section.classList.remove("leverless", "arcade", "gamepad");

                // Add new class based on JSON value
                if (newValue === "Leverless") {
                    section.classList.add("leverless");
                } else if (newValue === "Arcade Stick") {
                    section.classList.add("arcade");
                } else if (newValue === "Gamepad") {
                    section.classList.add("gamepad");
                }
            };
        }

        if (updateFunc) updateFunc();
    });
}

      


    function updateControllersFromJSON(data) {
    ["p1", "p2", "p3", "p4"].forEach(p => {
        const section = document.querySelector(`.${p}controller-section`);
        const display = document.getElementById(`${p}controller-display`);
        if (!section || !display) {
            console.error(`Element not found for ${p}controller-section or ${p}controller-display`);
            return;
        }

        // Clear previous controller image classes
        display.classList.remove("leverless", "arcade", "gamepad");
        display.style.display = "none"; // Hide by default

        // Add the correct class based on the JSON value
        const controllerType = data[`${p}Controller`];
        console.log(`Updating ${p}controller-display with controller type: ${controllerType}`); // Debugging

        if (controllerType === "Leverless") {
            display.classList.add("leverless");
            display.style.display = "block";
        } else if (controllerType === "Arcade Stick") {
            display.classList.add("arcade");
            display.style.display = "block";
        } else if (controllerType === "Gamepad") {
            display.classList.add("gamepad");
            display.style.display = "block";
        } else if (controllerType === "None") {
            display.style.display = "none"; // Hide the controller display
            // Only set background-color to transparent if "None" is selected
            section.style.backgroundColor = "transparent";
        } else {
            console.warn(`Unknown controller type for ${p}: ${controllerType}`);
        }
    });
}
    
    // Modern polling with fetch
    const fetchHeaders = new Headers();
    fetchHeaders.append("pragma", "no-cache");
    fetchHeaders.append("cache-control", "no-cache");
    const fetchInit = {
        method: "GET",
        headers: fetchHeaders,
    };

    async function pollState() {
        try {

            
            const response = await fetch(streamJSON + '?v=' + Date.now(), fetchInit);
            if (!response.ok) throw new Error('Network response was not ok');
            scObj = await response.json();
            updateControllersFromJSON(scObj);
            if (animated === true) {
                scoreboard();
            }
        } catch (e) {
            // Optionally log error
            // console.error(e);
        }
    }

    
    pollState();
    setInterval(pollState, 500); //runs polling function twice per second


    function showP3P4Controllers() {
    // Make P3 and P4 controllers and related elements visible
    TweenMax.set('#leftWrapper_2, #rightWrapper_2, .p3controller-section, .p4controller-section, #p3Name, #p4Name, #p3Wrapper, #p4Wrapper, #p3Score, #p4Score, #leftBGWrapper_2, #rightBGWrapper_2', { css: { display: 'flex', opacity: 1, visibility:  'visibile'} });
}

    function hideP3P4Controllers() {
    // Fade out P3 and P4 controllers and related elements, then hide them
    TweenMax.to('#leftWrapper_2, #rightWrapper_2, .p3controller-section, .p4controller-section, #p3Name, #p4Name, #p3Wrapper, #p4Wrapper, #p3Score, #p4Score, #leftBGWrapper_2, #rightBGWrapper_2', 0.25, {
        css: { opacity: 0 },
        ease: Quad.easeOut,
        onComplete: function () {
            TweenMax.set(' #leftWrapper_2, #rightWrapper_2, .p3controller-section, .p4controller-section, #p3Name, #p4Name, #p3Wrapper, #p4Wrapper, #p3Score, #p4Score, #leftBGWrapper_2, #rightBGWrapper_2', { css: { display: 'none' } });
        }
    });
}

    function applyGameLayout(game) {
        // Default layout adjustments
        if (game === 'BBTAG' || game === 'SFVCE' || game === 'TEKKEN7' || game === 'UNICLR') {
            TweenMax.set('#leftWrapper', { css: { y: adjust1 } });
            TweenMax.set('#rightWrapper', { css: { y: adjust1 } });
        } else if (game === 'BBCF' || game === 'DBFZ' || game === 'GGXRD' || game === 'KOFXIV' || game === 'MVCI' || game === 'UMVC3') {
            TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
            TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
        } else if (game === 'SF6') {
            TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
            TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
        } else if (game === '2XKO') {
            TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
            TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
            showP3P4Controllers();
            TweenMax.to('#p3Wrapper, #p4Wrapper', 0.5, { css: { opacity: 1 }, ease: Quad.easeOut });
        } else {
            TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
            TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
        }

        // Layout-specific controller positions and background colors
        const layoutOption = scObj['scoreboardLayout'] || 'Default';
        if (layoutOption === 'Image 1') {
            // Controller positions for Image 1 layout
            TweenMax.to('.p1controller-section', 0.5, { top: '32px', left: '210px', backgroundColor: '#EB6F25' }); // Example color
            TweenMax.to('.p2controller-section', 0.5, { top: '32px', right: '204px', backgroundColor: '#438BBE' });
            TweenMax.to('.p3controller-section', 0.5, { top: '180px', left: '289px', backgroundColor: '#EB6F25' });
            TweenMax.to('.p4controller-section', 0.5, { top: '180px', right: '289px', backgroundColor: '#438BBE' });

            // Flag positions for Image 1 layout
            TweenMax.to('#p1Flag', 0.5, { left: '-74px', top: '10px' });
            TweenMax.to('#p2Flag', 0.5, { right: '-84px', top: '12px' });
        } else if (layoutOption === 'Image 2') {
            // Controller positions for Image 2 layout
            TweenMax.to('.p1controller-section', 0.5, { top: '30px', left: '256px', backgroundColor: '#030716' });
            TweenMax.to('.p2controller-section', 0.5, { top: '30px', right: '280px', backgroundColor: '#030716' });
            TweenMax.to('.p3controller-section', 0.5, { top: '180px', left: '290px', backgroundColor: '#030716' });
            TweenMax.to('.p4controller-section', 0.5, { top: '180px', right: '390px', backgroundColor: '#030716' });

            // Flag positions for Image 2 layout
            TweenMax.to('#p1Flag', 0.5, { left: '-92px', top: '0px' });
            TweenMax.to('#p2Flag', 0.5, { right: '-92px', top: '0px' });
        } else {
            // Default positions for controllers
            TweenMax.to('.p1controller-section', 0.5, { top: '32px', left: '250px', backgroundColor: '#E50061' });
            TweenMax.to('.p2controller-section', 0.5, { top: '32px', right: '250px', backgroundColor: '#1082E6' });
            TweenMax.to('.p3controller-section', 0.5, { top: '180px', left: '400px', backgroundColor: '#E50061' });
            TweenMax.to('.p4controller-section', 0.5, { top: '180px', right: '400px', backgroundColor: '#1082E6' });

            // Default positions for flags
            TweenMax.to('#p1Flag', 0.5, { left: '-48px', top: '4px' });
            TweenMax.to('#p2Flag', 0.5, { right: '-48px', top: '4px' });
        }
    }

    var lastGame = null; // Add this at the top, outside functions

    function scoreboard() {
        game = scObj['game'];
        $('#gameHold').html(game);

        // Only run layout/animation if game changed
        if (game !== lastGame) {
            applyGameLayout(game);
            lastGame = game;
        }

        if (startup == true) {
            getData();
            setTimeout(logoLoop, logoTime);
            startup = false;
            animated = true;
        } else {
            getData();
        }
    }

    setTimeout(scoreboard, 300);

    function getData() {
        var p1Name = scObj['p1Name']; //creates local variables to store data parsed from json
        var p2Name = scObj['p2Name'];
        var p3Name = scObj['p3Name'];
        var p4Name = scObj['p4Name'];

        // Truncate names longer than 20 characters
        if (p1Name.length > 20) p1Name = p1Name.substring(0, 20) + '...';
        if (p2Name.length > 20) p2Name = p2Name.substring(0, 20) + '...';
        if (p3Name.length > 20) p3Name = p3Name.substring(0, 20) + '...';
        if (p4Name.length > 20) p4Name = p4Name.substring(0, 20) + '...';

        $('#p1Name').html(p1Name);
        $('#p2Name').html(p2Name);
        $('#p3Name').html(p3Name);
        $('#p4Name').html(p4Name);

        var p1Team = scObj['p1Team'];
        var p2Team = scObj['p2Team'];
        var p1Score = scObj['p1Score'];
        var p2Score = scObj['p2Score'];
        var round = scObj['round'];
        var p3Name = scObj['p3Name']; // <-- Add this
        var p4Name = scObj['p4Name']; // <-- Add this
        var p1Flag = scObj['p1Flag'];
        var p2Flag = scObj['p2Flag'];

        updateControllersFromJSON(scObj);

        // Set flag emoji directly
        if (p1Flag && p1Flag.length === 2) {
            $('#p1Flag').html(getFlagEmoji(p1Flag));
        } else {
            $('#p1Flag').html('');
        }
        if (p2Flag && p2Flag.length === 2) {
            $('#p2Flag').html(getFlagEmoji(p2Flag));
        } else {
            $('#p2Flag').html('');
        }

        var layoutOption = scObj['scoreboardLayout'] || 'Default';

        // List all text element IDs you want to update
        var textIds = [
            'p1Name', 'p2Name', 'p3Name', 'p4Name',
            'p1Team', 'p2Team',
            'p1Score', 'p2Score', 'p3Score', 'p4Score',
            'round'
        ];

        textIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                if (layoutOption === 'Image 1') {
                    el.classList.add('image1-font');
                    el.classList.remove('image2-font');
                } else if (layoutOption === 'Image 2') {
                    el.classList.add('image2-font');
                    el.classList.remove('image1-font');
                } else {
                    el.classList.remove('image1-font');
                    el.classList.remove('image2-font');
                }
            }
        });

        // Ensure round/rdWrapper stays white in image2
        var rdWrapper = document.getElementById('rdWrapper');
        var roundEl = document.getElementById('round');
        if (layoutOption === 'Image 2') {
            if (rdWrapper) rdWrapper.classList.add('image2-font');
            if (roundEl) roundEl.classList.add('image2-font');
        } else {
            if (rdWrapper) rdWrapper.classList.remove('image2-font');
            if (roundEl) roundEl.classList.remove('image2-font');
        }

        var layoutClass = 'default-bg';
        if (layoutOption === 'Image 1') layoutClass = 'image1-bg';
        if (layoutOption === 'Image 2') layoutClass = 'image2-bg';

        [
            'p1PlayerBG', 'p1ScoreBG', 'p1Score', 'p1Wrapper',
            'p2PlayerBG', 'p2ScoreBG', 'p2Score', 'p2Wrapper',
            'p3PlayerBG', 'p3ScoreBG', 'p3Score', 'p3Wrapper',
            'p4PlayerBG', 'p4ScoreBG', 'p4Score', 'p4Wrapper'
        ].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.classList.remove('default-bg', 'image1-bg', 'image2-bg');
                el.classList.add(layoutClass);
            }
        });

        // Update flag backgrounds for layout
        ['p1Flag', 'p2Flag'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.classList.remove('default-bg', 'image1-bg', 'image2-bg');
                el.classList.add(layoutClass);
            }
        });

        // Update roundBG for layout
        var roundBG = document.getElementById('roundBG');
        if (roundBG) {
            roundBG.classList.remove('image1-bg', 'image2-bg');
            if (layoutOption === 'Image 1') {
                roundBG.classList.add('image1-bg');
            } else if (layoutOption === 'Image 2') {
                roundBG.classList.add('image2-bg');
            }
        }

        if (startup == true) {

            TweenMax.set('#p1Wrapper', { css: { x: p1Move } }); //sets name/round wrappers to starting positions for them to animate from
            TweenMax.set('#p2Wrapper', { css: { x: p2Move } });
            TweenMax.set('#round', { css: { y: rdMove } });

            $('#p1Name').html(p1Name); //changes html object values to values stored in local variables
            $('#p2Name').html(p2Name);
            $('#p1Team').html(p1Team);
            $('#p2Team').html(p2Team);
            $('#p1Score').html(p1Score);
            $('#p2Score').html(p2Score);
            $('#round').html(round);

            $('#p3Name').html(p3Name); // <-- Add this
            $('#p4Name').html(p4Name); // <-- Add this

            p1Wrap.each(function (i, p1Wrap) { //function to resize font if text string is too long and causes div to overflow its width/height boundaries
                while (p1Wrap.scrollWidth > p1Wrap.offsetWidth || p1Wrap.scrollHeight > p1Wrap.offsetHeight) {
                    var newFontSize = (parseFloat($(p1Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                    $(p1Wrap).css('font-size', newFontSize);
                }
            });

            p2Wrap.each(function (i, p2Wrap) {
                while (p2Wrap.scrollWidth > p2Wrap.offsetWidth || p2Wrap.scrollHeight > p2Wrap.offsetHeight) {
                    var newFontSize = (parseFloat($(p2Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                    $(p2Wrap).css('font-size', newFontSize);
                }
            });

            // Add these for P3 and P4:
            p3Wrap.each(function (i, p3Wrap) {
                while (p3Wrap.scrollWidth > p3Wrap.offsetWidth || p3Wrap.scrollHeight > p3Wrap.offsetHeight) {
                    var newFontSize = (parseFloat($(p3Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                    $(p3Wrap).css('font-size', newFontSize);
                }
            });

            p4Wrap.each(function (i, p4Wrap) {
                while (p4Wrap.scrollWidth > p4Wrap.offsetWidth || p4Wrap.scrollHeight > p4Wrap.offsetHeight) {
                    var newFontSize = (parseFloat($(p4Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                    $(p4Wrap).css('font-size', newFontSize);
                }
            });

            rdResize.each(function (i, rdResize) {
                while (rdResize.scrollWidth > rdResize.offsetWidth || rdResize.scrollHeight > rdResize.offsetHeight) {
                    var newFontSize = (parseFloat($(rdResize).css('font-size').slice(0, -2)) * .95) + 'px';
                    $(rdResize).css('font-size', newFontSize);
                }
            });

            TweenMax.to('#p1Wrapper', nameTime, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: nameDelay }); //animates wrappers traveling back to default css positions while
            TweenMax.to('#p2Wrapper', nameTime, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: nameDelay }); //fading them in, timing/delay based on variables set in scoreboard.html

            // Add these for P3 and P4:
            TweenMax.to('#p3Wrapper', nameTime, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: nameDelay });
            TweenMax.to('#p4Wrapper', nameTime, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: nameDelay });

            TweenMax.to('#round', rdTime, { css: { y: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: rdDelay });
            TweenMax.to('.scores', scTime, { css: { opacity: 1 }, ease: Quad.easeOut, delay: scDelay });
        }
        else {
            game = scObj['game']; //if this is after the first time that getData function has run, changes the value of the local game variable to current json output

            if ($('#p1Name').text() != p1Name || $('#p1Team').text() != p1Team) { //if either name or team do not match, fades out wrapper and updates them both
                TweenMax.to('#p1Wrapper', .3, { css: { x: p1Move, opacity: 0 }, ease: Quad.easeOut, delay: 0, onComplete: function () { //uses onComplete parameter to execute function after TweenMax
                    $('#p1Wrapper').css('font-size', nameSize); //restores default font size based on variable set in scoreboard.html
                    $('#p1Name').html(p1Name); //updates name and team html objects with current json values
                    $('#p1Team').html(p1Team);

                    p1Wrap.each(function (i, p1Wrap) {//same resize functions from above
                        while (p1Wrap.scrollWidth > p1Wrap.offsetWidth || p1Wrap.scrollHeight > p1Wrap.offsetHeight) {
                            var newFontSize = (parseFloat($(p1Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                            $(p1Wrap).css('font-size', newFontSize);
                        }
                    });

                    TweenMax.to('#p1Wrapper', .3, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: .2 }); //fades name wrapper back in while moving to original position
                } });
            }

            if ($('#p2Name').text() != p2Name || $('#p2Team').text() != p2Team) {
                TweenMax.to('#p2Wrapper', .3, { css: { x: p2Move, opacity: 0 }, ease: Quad.easeOut, delay: 0, onComplete: function () {
                    $('#p2Wrapper').css('font-size', nameSize);
                    $('#p2Name').html(p2Name);
                    $('#p2Team').html(p2Team);

                    p2Wrap.each(function (i, p2Wrap) {
                        while (p2Wrap.scrollWidth > p2Wrap.offsetWidth || p2Wrap.scrollHeight > p2Wrap.offsetHeight) {
                            var newFontSize = (parseFloat($(p2Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
                            $(p2Wrap).css('font-size', newFontSize);
                        }
                    });

                    TweenMax.to('#p2Wrapper', .3, { css: { x: '+0px', opacity: 1 }, ease: Quad.easeOut, delay: .2 });
                } });
            }

            if ($('#round').text() != round) {
                TweenMax.to('#round', .3, { css: { opacity: 0 }, ease: Quad.easeOut, delay: 0, onComplete: function () { //same format as changing names just no change in positioning, only fade in/out
                    $('#round').css('font-size', rdSize);
                    $('#round').html(round);

                    rdResize.each(function (i, rdResize) {
                        while (rdResize.scrollWidth > rdResize.offsetWidth || rdResize.scrollHeight > rdResize.offsetHeight) {
                            var newFontSize = (parseFloat($(rdResize).css('font-size').slice(0, -2)) * .95) + 'px';
                            $(rdResize).css('font-size', newFontSize);
                        }
                    });

                    TweenMax.to('#round', .3, { css: { opacity: 1 }, ease: Quad.easeOut, delay: .2 });
                } });
            }

            if ($('#p1Score').text() != p1Score) { //same as round, no postioning changes just fade out, update text, fade back in
                TweenMax.to('#p1Score', .3, { css: { opacity: 0 }, ease: Quad.easeOut, delay: 0, onComplete: function () {
                    $('#p1Score').html(p1Score);

                TweenMax.to('#p1Score', .3, { css: { opacity: 1 }, ease: Quad.easeOut, delay: .2 });
                } });
            }

            if ($('#p2Score').text() != p2Score) {
                TweenMax.to('#p2Score', .3, { css: { opacity: 0 }, ease: Quad.easeOut, delay: 0, onComplete: function () {
                    $('#p2Score').html(p2Score);

                TweenMax.to('#p2Score', .3, { css: { opacity: 1 }, ease: Quad.easeOut, delay: .2 });
                } });
            }

            if ($('#gameHold').text() != game) { //checks to see if current json value for 'game' has changed from what is stored in gameHold html object
                TweenMax.to('#scoreboardBG', .3, { css: { opacity: 0 }, delay: 0 });
                TweenMax.to('#scoreboard', .3, { css: { opacity: 0 }, delay: 0 }); //hide scoreboard background, scoreboard text, and logos
                TweenMax.to('.logos', .3, { css: { opacity: 0 }, delay: 0, onComplete: function () { //then execute function
                    $('#gameHold').html(game); //updates gameHold html object with new game dropdown value

                    if (game == 'BBTAG' || game == 'SFVCE' || game == 'TEKKEN7' || game == 'UNICLR') {
                        offset = document.getElementById("leftBGWrapper").offsetTop;
                        TweenMax.fromTo('#leftBGWrapper', 0.5, { css: { y: offset } }, { css: { y: adjust1 } })
                        TweenMax.fromTo('#rightBGWrapper', 0.5, { css: { y: offset } }, { css: { y: adjust1 } })
                        TweenMax.set('#leftWrapper', { css: { y: '4px' } });
                        TweenMax.set('#rightWrapper', { css: { y: '4px' } });
                    }
                    else if (game == 'BBCF' || game == 'DBFZ' || game == 'GGXRD' || game == 'KOFXIV' || game == 'MVCI' || game == 'UMVC3') {
                        TweenMax.set('#leftBGWrapper', { css: { y: '+0px' } });
                        TweenMax.set('#rightBGWrapper', { css: { y: '+0px' } });
                        TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
                        TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
                    }
                    else if (game == 'USF4') {
                        TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
                        TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
                    }
                    else {
                        TweenMax.set('#leftWrapper', { css: { y: adjust2 } });
                        TweenMax.set('#rightWrapper', { css: { y: adjust2 } });
                    }
                    if (game == 'BBTAG' || game == 'UNICLR') {
                        var adjustLgW = parseFloat(adjustLg[3]) * adjustLg[2]; //var changed so that it bases resized on original logo size rather than current value
                        var adjustLgH = parseFloat(adjustLg[4]) * adjustLg[2]; //uses variables stored in the 'adjustLg' array in scoreboard.html
                        TweenMax.set('.logos', { css: { x: adjustLg[0], y: adjustLg[1], width: adjustLgW, height: adjustLgH } });
                        TweenMax.set('.logos', { css: { x: adjustLg[0], y: adjustLg[1] } });
                    }
                    else {
                        TweenMax.set('.logos', { css: { x: '+0px', y: '+0px', width: adjustLg[3], height: adjustLg[4] } }); //also return logos to original positioning and size
                    }

                    playCSSAnimations();

                    TweenMax.to('#scoreboardBG', .3, { css: { opacity: 1 }, delay: .3 }); //fade background/text objects back in with enough delay for scoreboard to finish playing first
                    TweenMax.to('#scoreboard', .3, { css: { opacity: 1 }, delay: .3 });
                    TweenMax.to('.logos', .3, { css: { opacity: .7 }, delay: .3 }); //TweenMax to fade logos back in, note to fade them to same opacity as default in CSS
                } });
            }
        }
    }

    // After layout changes or in getData(), ensure scores are visible
    TweenMax.to('.scores', 0.3, { css: { opacity: 1 }, ease: Quad.easeOut });

    function playCSSAnimations() {
        // Animate Player 1
        TweenMax.fromTo("#p1Wrapper", 0.7, { x: -300, opacity: 0 }, { x: 0, opacity: 1, ease: Power2.easeOut });
        // Animate Player 2
        TweenMax.fromTo("#p2Wrapper", 0.7, { x: 300, opacity: 0 }, { x: 0, opacity: 1, ease: Power2.easeOut });
        // Animate Player 3
        TweenMax.fromTo("#p3Wrapper", 0.7, { x: -300, opacity: 0 }, { x: 0, opacity: 1, ease: Power2.easeOut });
        // Animate Player 4
        TweenMax.fromTo("#p4Wrapper", 0.7, { x: 300, opacity: 0 }, { x: 0, opacity: 1, ease: Power2.easeOut });
    }

    function logoLoop() {
        var initialTime = 700; //initial fade-in time for first logo
        var intervalTime = 15000; //amount of time between changing of logos
        var fadeTime = 2000; //duration of crossfade between logos
        var currentItem = 0; //placement value within logoWrapper container of current logo being operated on in function
        var itemCount = $('#logoWrapper').children().length; //number of logo <img> objects located within logoWrapper container

        if (itemCount > 1) {
            $('#logoWrapper').find('img').eq(currentItem).fadeIn(initialTime);

            setInterval(function () {

                $('#logoWrapper').find('img').eq(currentItem).fadeOut(fadeTime);

                if (currentItem == itemCount - 1) {
                    currentItem = 0;
                }
                else {
                    currentItem++;
                }

                $('#logoWrapper').find('img').eq(currentItem).fadeIn(fadeTime);

            }, intervalTime);
        }
        else {
            $('.logos').fadeIn(initialTime);
        }
    }

    
}

