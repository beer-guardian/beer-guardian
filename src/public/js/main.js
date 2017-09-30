(function() {
  

    
    $(function() {


      // console.log(isSafari())

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




      $('.beer-cards .card').click(function() {
        openModal(isSafari() ? 0.3 : 0)
      })


    });
    
    
    
    
    function openModal() {

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