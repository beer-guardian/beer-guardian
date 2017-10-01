(function() {
  

    
    $(function() {

      //debug
      // openAddBeerModal()
      //debug

      $("#pass + .close").on('click', function() {
        $("#pass").val('');
      });

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



      $('#input-beer-search').keypress(function (e) {
        if (e.which == 13) {
          beerSearch($('#input-beer-search').val())
          return false;
        }
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
        $( "#input-beer-search" ).focus();
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


    function beerSearch(query) {
      var url = '/api/v1/search?q='+query;
      $.get(url,function(data) {
        $.each(data,function(key,value) {
          $('.add-beer-modal ul').append('<li data-id="'+value.id+'"><div>'+value.name+'</div><div class="small">'+value.breweries[0].name+'</div></li>');
        });
      });
    }

    function beerRequest(id) {
      var data = {
        beer: id
      }
      // $.ajax({
      //   type: "POST",
      //   url: '/api/v1/request',
      //   data: data,
      //   success: success,
      //   dataType: dataType
      // });
      $.post('/api/v1/request', function(data ) {
        $( ".result" ).html( data );
      });
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
    

    $('body').on('click', '.add-beer-modal li', function() {
      console.log(true)
    });
    
    
    
  })();