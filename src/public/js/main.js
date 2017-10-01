(function() {
  

    
    $(function() {



      //color the negative scores in red
      scoreColor()

      //init tilt js cards with options
      const tilt = $('.js-tilt').tilt({
        glare: isSafari() ? false : true,
        maxGlare: isSafari() ? 0 : 0.3,
        speed: 400,
        scale: 1,
        maxTilt: 10,
        perspective: 500
      });



      //modal open and close clicks
      $('.beer-cards .card').click(function() {
        openModal()
        // tilt.tilt.destroy.call(tilt);
      })
      $('.modal-cover').click(function() {
        closeModal()
      })
      $('.modal-close').click(function() {
        closeModal()
      })


    });
    
    
    
    
    function openModal() {
      $('.modal-cover').fadeIn('fast')
      $('.modal').addClass('reveal');
    }
    function closeModal() {
      $('.modal-cover').fadeOut('fast')
      $('.modal').removeClass('reveal');
    }
    

    function scoreColor() {
      $('.card .score span').each(function() {
        var parseScore = parseFloat($(this).text());
        if (parseScore < 0) {
          console.log(true)
          $(this).addClass('negative')
        }
      });
    }
    
    function isSafari() {
      var ua = navigator.userAgent.toLowerCase(); 
      if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
          return false
        } else {
          return true
        }
      }
    }
    
    
    
    
  })();