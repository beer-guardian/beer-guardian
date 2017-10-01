(function() {
  

    
    $(function() {

      if (window.location.pathname == '/') {

   

        $("#pass + .close").on('click', function() {
          $("#pass").val('');
        });

        //color the negative scores in red
        scoreColor()

        //init tilt js cards with options
        if (!isSafari()) {
          const tilt = $('.js-tilt').tilt({
            glare: true,
            maxGlare: 0.3,
            speed: 400,
            scale: 1,
            maxTilt: 10,
            perspective: 500
          });
        }
        



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
            id: $(this).attr("data-id"),
            score: $(this).attr("data-score"),
            label: $(this).css("background-image")
          }
          openActiveBeerModal(beer)
        })

        $(".card .vote-up").click(function (e) {
          var id = $(this).parent().parent().attr("data-id");
          vote(id,'UP')
          e.stopPropagation();
        });
        $(".card .vote-down").click(function (e) {
          var id = $(this).parent().parent().attr("data-id");
          vote(id,'DOWN')
          e.stopPropagation();
        });
        
        $(".active-beer-modal .vote-up").click(function() {
          var id = $('.active-beer-modal').attr('id')
          console.log(id)
          vote(id,'UP')
          // closeModal()
        });
        $(".active-beer-modal .vote-down").click(function() {
          var id = $('.active-beer-modal').attr('id')
          console.log(id)
          vote(id,'DOWN')
          // closeModal()
        });




        $('.beer-cards .card-add').click(function() {
          openAddBeerModal()
          setTimeout(function() { $('#input-beer-search').focus() }, 100);
        })
        $('.modal-cover').click(function() {
          closeModal()
        })
        $('.modal-close').click(function() {
          closeModal()
        })



        //admin route
      } else if (window.location.pathname == '/admin') {

        var clickedTab = $(".tabs > .active");
        var tabWrapper = $(".tab__content");
        var activeTab = tabWrapper.find(".active");
        var activeTabHeight = activeTab.outerHeight();
        activeTab.show();
        tabWrapper.height(activeTabHeight);
        $(".tabs > li").on("click", function() {
          $(".tabs > li").removeClass("active");
          $(this).addClass("active");
          clickedTab = $(".tabs .active");
          activeTab.fadeOut(250, function() {
            $(".tab__content > li").removeClass("active");
            var clickedTabIndex = clickedTab.index();
            $(".tab__content > li").eq(clickedTabIndex).addClass("active");
            activeTab = $(".tab__content > .active");
            activeTabHeight = activeTab.outerHeight();
            tabWrapper.stop().delay(50).animate({
              height: activeTabHeight
            }, 500, function() {
              activeTab.delay(50).fadeIn(250);
            });
          });
        });
        var colorButton = $(".colors li");
        colorButton.on("click", function(){
          $(".colors > li").removeClass("active-color");
          $(this).addClass("active-color");
          var newColor = $(this).attr("data-color");
          $(".bg-color").css("background-color", newColor);
          $(".text-color").css("color", newColor);
        });


        $.get('/api/v1/beers',function(data) {
          $.each(data,function(key,value){
            $('.admin .beers-table').append('<tr><td><a href="/admin/forms/beer/'+value._id+'">'+value._id+'</a></td>' +
            '<td>'+value.name+'</td>' +
            '<td>'+value.brewery+'</td>' +
            '<td>'+value.brewerydbId+'</td>' +
            '<td>'+value.score+'</td>' +
            '</tr>');
          })
        });

        $.get('/api/v1/admin/requests',function(data) {
          $.each(data,function(key,value){
            $('.admin .requests-table').append('<tr><td>'+value._id+'</td>' +
            '<td>'+value.name+'</td>' +
            '<td>'+value.brewerydbId+'</td>' +
            '<td><a class="approve-link" href="/admin/forms/request/'+value._id+'">APPROVE</a><a class="approve-link deny" href="/admin/forms/deny/'+value._id+'">DENY</a></td>' +
            '</tr>');
          })
        });

        $.get('/api/v1/admin/users',function(data) {
          console.log(data)
          $.each(data,function(key,value){
            $('.admin .users-table').append('<tr><td>'+value._id+'</td>' +
            '<td>'+value.email+'</td>' +
            '<td>'+value.admin+'</td>' +
            '</tr>');
          })
        });
      }

    });
    
    
    
    
    function openActiveBeerModal(beer) {
      console.log(beer)
      $('.active-beer-modal').attr('id',beer.id)
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
      $('.add-beer-modal ul').empty();
      $( "#input-beer-search" ).val('');
      $( "#input-beer-search" ).removeClass('disabled');
      $('.modal-cover').fadeOut('fast');
      $('.modal').removeClass('reveal');
    }

    function beerSearch(query) {
      $('.add-beer-modal ul').empty();
      var url = '/api/v1/search?q='+query;
      if (query!=='') {
        $.get(url,function(data) {
          console.log(data)
          $.each(data,function(key,value) {
            if (value.breweries) {
              $('.add-beer-modal ul').append('<li data-id="'+value.id+'"><div>'+value.name+'</div><div class="small">'+value.breweries[0].name+'</div></li>');
            }
          });
          $('.add-beer-modal ul').append("<li data-name='"+query+"'><div>'"+query+"'</div><div class='small'>Don't see what you want? Submit your current search term.</div></li>");
        });
      }
    }

    function beerRequest(name,id) {
      $.post('/api/v1/request', {beer: id, name:name}).done(function(data) {
        $('.add-beer-modal ul').empty();
        $( "#input-beer-search" ).val('Beer requested, thank you.');
        $( "#input-beer-search" ).addClass('disabled');
      });
    }
    
    function vote(id, direction) {
      $.post('/api/v1/vote', {beer: id, vote: direction}).done(function(data) {
        refreshScore(id)
      });
    }

    function scoreColor() {
      $('.card .score span').each(function() {
        var parseScore = parseFloat($(this).text());
        if (parseScore < 0) {
          $(this).addClass('negative')
        } else {
          $(this).removeClass('negative')
        }
      });
    }

    function refreshScore(id) {
      var url = '/api/v1/beers/'+id;
      $.get(url,function(data) {
        console.log(data.score)
        $('#'+id+' .score span').html(data.score)
        $('#'+id+'').attr('data-score',data.score)
        $('#'+id+'.active-beer-modal .score .number').html(data.score)
        scoreColor();
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
      var name = $(this).attr("data-name");
      if (name == undefined) {
        name = null;
      }
      var id = $(this).attr("data-id");
      if (id == undefined) {
        id = null;
      }
      beerRequest(name,id)
    });
    
    
    
  })();