(function() {
  

    
    $(function() {

      //color the negative scores in red
      scoreColor()

      //init tilt js cards with options
      const tilt = $('.js-tilt').tilt({
        // glare: true,
        maxGlare: 0.3,
        speed: 400,
        scale: 1,
        maxTilt: 10,
        perspective: 500
      });


      $('.beer-cards .card').click(function() {
        openModal()
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
    
    
    
    
    
    
  })();