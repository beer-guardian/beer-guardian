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
      $('.beer-cards .card-active').click(function() {
        var beer = {
          name: $(this).find('.title').text(),
          brewery: $(this).find('.meta').text(),
          desc: $(this).find('.desc').text(),
          abv: $(this).attr("data-abv"),
          ibu: $(this).attr("data-ibu"),
          score: $(this).attr("data-score"),
          label: $(this).css("background-image")
        }
        openActiveBeerModal(beer)
      })
      $('.beer-cards .card-add').click(function() {
        openAddBeerModal()
      })
      $('.modal-cover').click(function() {
        closeModal()
      })
      $('.modal-close').click(function() {
        closeModal()
      })


    });
    
    
    
    
    function openActiveBeerModal(beer) {
      console.log(beer)
      $('.active-beer-modal .header .title').html(beer.name)
      $('.active-beer-modal .brewery').html(beer.brewery)
      $('.active-beer-modal .body p').html(beer.desc)
      $('.active-beer-modal .widget.abv .number').html(beer.abv)
      $('.active-beer-modal .widget.ibu .number').html(beer.ibu)
      $('.active-beer-modal .widget.score .number').html(beer.score)
      $('.active-beer-modal .image').css('background-image',beer.label)
      $('.modal-cover').fadeIn('fast')
      $('.active-beer-modal').addClass('reveal');
    }
    function openAddBeerModal() {
      $('.modal-cover').fadeIn('fast')
      $('.add-beer-modal').addClass('reveal');
    }
    function closeModal() {
      $('.modal-cover').fadeOut('fast')
      $('.modal').removeClass('reveal');
    }
    

    function scoreColor() {
      $('.card .score span').each(function() {
        var parseScore = parseFloat($(this).text());
        if (parseScore < 0) {
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