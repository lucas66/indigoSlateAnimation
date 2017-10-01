 $(function(){
     //on page load
     //init UI elements
                    $('.btn-menu').on('click', function(){
                        //add click event
                        if(!$(this).hasClass('is-active')){
                            //if button is closed, open it.
                            $(this).addClass('open');
                            //open main nav too
                            $('#main').addClass('open');
                            //add animation event listener, callback sets is-active state
                            onAnimationEnd($(this), function(){
                                $('.btn-menu').addClass('is-active');
                            });
                            onAnimationEnd($('#main'), function(){                              
                                $('#main').addClass('is-active');
                            });
                        }
                        else{
                            //if button is open, close it
                            $(this).removeClass('open');
                            //close nav & add event listeners
                            $('#main').removeClass('open');
                            onAnimationEnd($(this), function(){
                                $('.btn-menu').removeClass('is-active');
                            });
                            onAnimationEnd($('#main'), function(){                              
                                $('#main').removeClass('is-active');
                            });
                        }
                    });
                    //init main nav
                    $('#main').find('.arrow').on('click', function(){
                            //if subnav has html, unbind events.
                            $('.close').unbind('click');
                            $('#subNavContainer').html('');     
                            //selected row          
                            var row = $(this).parent('.item');
                            $(row).addClass('selected');
                            //key off of row text for data - in prod, should be index number or someother immutable element
                            var idx = $(this).siblings('p').text();
                            //ajax call to api
                             $.ajax({
                                url: '/api/subNav1',
                                dataType: 'json',
                                cache: false,
                                success: function(data) {
                                    //iternate through data and add html to SubNav
                                   $.each(data, function(key, value){
                                       if(key == idx){
                                           var head = '<div class="item heading"><p class="left">' + key + '</p><div class="close right"></div><div class="separator"></div></div>';
                                           $('#subNavContainer').append(head);
                                           $.each(value, function(ke, val){
                                               $.each(val, function(k, v){
                                                    var html = '<div class="item"><p class="left">' + k + '</p><div class="arrow right"></div><div class="separator"></div></div>';
                                                    $('#subNavContainer').find('.heading').append(html);
                                                    
                                                    var subrow = '<div class="subrowItems hide"></div>';
                                                    $('#subNav1').find('.item').last().append(subrow);

                                                    var subsubrow = '';

                                                    $.each(v, function(i, a){
                                                        subsubrow += '<div class="item"><p class="left">' + a + '</p><div class="separator"></div></div>';
                                                    });
                                                    $('#subNav1').find('.subrowItems').last().append(subsubrow);
                                               });
                                           });
                                       }
                                   })
                                },
                                error: function(xhr, status, err) {
                                    console.log(err);
                                }
                            }).done(function(){
                                //when ajax is done open the subnav, add animation event listener
                                $('#subNav1').addClass('open');
                                   onAnimationEnd($('#subNav1'), function(){
                                       $('#subNav1').addClass('is-active');
                                          //add click event on close buttons
                                        $('.close').on('click', function(){
                                            $('#subNav1').removeClass('open');
                                            onAnimationEnd($('#subNav1'), function(){
                                                $('#subNav1').removeClass('is-active');
                                                resetSelectedItems();
                                        }) 
                                   })
                                
                                });
                                //add click event on arrow buttons.
                                $('#subNav1').find('.arrow').each(function(){
                                    $(this).on('click', function(){
                                        var subrowItems  = $(this).parent('.item');
                                        var subItems = $(subrowItems).find('.subrowItems');
                                        //no CSS animations here.  Jquery is handling the slide down/up 
                                        if($(subItems).hasClass('hide')){
                                            $(this).addClass('selected');
                                            $(subItems).slideDown(150, function(){
                                                $(this).removeClass('hide');
                                            })
                                        }
                                        else{
                                            $(this).removeClass('selected');
                                            $(subItems).slideUp(150, function(){
                                                $(this).addClass('hide');
                                            })
                                        }
                                    });
                                });
                                //add click event to nav to close the sub nav
                                $('#main').on('click', function(){
                                    if($('#subNav1').hasClass('open')){
                                        $('#subNav1').removeClass('open');
                                         onAnimationEnd($('#subNav1'), function(){
                                            $('#subNav1').removeClass('is-active');
                                            resetSelectedItems();
                                        })
                                    }
                                });
                            });
                        })
                    })
                //reset selected items
                function resetSelectedItems(){
                    $('#main').find('.item').each(function(){
                        if($(this).hasClass('selected'))
                            $(this).removeClass('selected');
                    })
                }
                //animation end event listner
                function onAnimationEnd(element, fn){
                    $(element).bind('oanimationend animationend webkitAnimationEnd', function() { 
                        if(fn)
                            fn();
                    });
                }