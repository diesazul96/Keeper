var dirs = [];
var culpable;
var condena = 0;
var nomCulpable;
App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    //Is there an injected web3 instance?
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      //If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Arrendar.json', function(data) {
      //Get the necessary contract artifact file and instantiate it with truffle-contract
      var ArrendarArtifact = data;
      App.contracts.Arrendar = TruffleContract(ArrendarArtifact);

      //Set the provider for our contract
      App.contracts.Arrendar.setProvider(App.web3Provider);
      console.log("bindEvents()");
      return App.registrarAnfitrion();
    });
    
  },

  bindEvents: function() {
    console.log("bindEvents");
    $(document).on('click', '#mostrar', App.mostrarTodo);
    $(document).on('click', '#owner', App.bindEvents6);
  },

  mostrarTodo: function() {
    $('#infoDomo').show();
    var arrendarInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
  
        var account = dirs[0];
        var account2 = dirs[1];
        console.log("cuenta1");
        console.log(account);
        console.log("cuenta2");
        console.log(account2);
  
        App.contracts.Arrendar.deployed().then(function(instance) {
          arrendarInstance = instance;

          console.log("cuenta1");
          console.log(account);
          console.log("cuenta2");
          console.log(account2);

          arrendarInstance.getName.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            $('#nomInv1').text(res);
          });

          arrendarInstance.getName.call({from: account2}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            $('#nomInv2').text(res);
          });

          arrendarInstance.getPoints.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            var $rateYo = $("#rateYo").rateYo();
            $("#rateYo").rateYo("option", "starWidth", "15px");
            $("#rateYo").rateYo("option", "readOnly", true);
            $rateYo.rateYo("rating", res);
          });

          arrendarInstance.getPoints.call({from: account2}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            var $rateYo2 = $("#rateYo2").rateYo();
            $("#rateYo2").rateYo("option", "starWidth", "15px");
            $("#rateYo2").rateYo("option", "readOnly", true);
            $rateYo2.rateYo("rating", res);
          });

          arrendarInstance.getNombre.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            $('#nomAnf').text(res);
          });

          arrendarInstance.getPrecio.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            $('#mens').text(res.toNumber());
          });
          
          arrendarInstance.getToken.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            $('#alca').text(web3.fromWei(res,'ether'));
          });

          arrendarInstance.numPipol.call({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }
            console.log("Numero de gente:");
            console.log(res.toNumber());
          });
          
        }).then(function(result) {
          return App.bindEvents5();
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },

  bindEvents2: function() {
    $(document).on('click', '#interes', App.showTC);
  },

  showTC: function() {
    $('#contrato').show();
    window.scrollTo(0,document.body.scrollHeight);
    App.bindEvents3();
  },

  bindEvents3: function() {
    $('#formGuest').show();
    window.scrollTo(0,document.body.scrollHeight);
    $(document).on('click', '#guest', App.registrarInvitado);
  },

  bindEvents6: function() {
    $('#contrato').show();
    window.scrollTo(0,document.body.scrollHeight);
    $(document).on('click', '#copeo', App.bindEvents3);
  },

  registrarInvitado: function(event) {
    //event.preventDefault();

    var nombre = $('#nameG').val();
    var pets = $('#petsG').prop('checked');
    var kids = $('#kidsG').prop('checked');
    
    var arrendarInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      dirs.push(account);
      console.log(dirs);
      
      App.contracts.Arrendar.deployed().then(function(instance) {
        arrendarInstance = instance;

        arrendarInstance.getPet.call({from: account}).then(function(res, err){
          if (err) {
            console.log(err);
          }
          console.log("Pet original:");
          console.log(res);
        });
        console.log("Pet usuario");
        console.log(pets);

        arrendarInstance.getKid.call({from: account}).then(function(res, err){
          if (err) {
            console.log(err);
          }
          console.log("Kid original:");
          console.log(res);
        });
        console.log("Kid usuario");
        console.log(kids);

        arrendarInstance.getAlcanciaEth.call({from: account}).then(function(res, err){
          if (err) {
            console.log(err);
          }
          console.log("Balance original:");
          console.log(web3.fromWei(res,'ether').toNumber());
        });

        arrendarInstance.balanceInv.call({from: account}).then(function(res, err){
          if (err) {
            console.log(err);
          }
          console.log("Balance usuario:");
          console.log(web3.fromWei(res,'ether').toNumber());
        });
        
        //Execute adopt as a transaction by sending account
        arrendarInstance.sendTransaction({from: account, gas: 50000, value: web3.toWei(7,'ether')});
        return arrendarInstance.arrendar(nombre, pets, kids, {from: account, gas: 1000000});
      }).then(function(result) {
        console.log("mostrarInvitado() y ether enviado");
        return App.invitarAmigo();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  bindEvents5: function() {
    $(document).on('click', '#invitar', App.invitarAmigo);
    $(document).on('click', '#inicio', App.esconder);
  },

  invitarAmigo: function() {
    console.log("invitando");
    $('#contrato').hide();
    $('#formGuest').hide();
    $('#nameG').val("");
    $('#tokens').val("");
    $('#petsG').removeAttr('checked');
    $('#kidsG').removeAttr('checked');
    $(document).on('click', '#guest', App.registrarInvitado);
  },

  sancionarInvitado: function() {
    var arrendarInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
  
        var account = culpable;
  
        App.contracts.Arrendar.deployed().then(function(instance) {
          arrendarInstance = instance;

          arrendarInstance.sancionar({from: account}).then(function(res, err){
            if (err) {
              console.log(err);
            }

            console.log("Nuevos Tokens: ");
            console.log(web3.fromWei(res,'ether').toNumber());

          });
        }).then(function(result) {
          return console.log("SANCIONADO!!");
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },

  registrarAnfitrion: function(event) {
    //event.preventDefault();

    console.log("Resgitrando anfitrion");

    var nombre = "Liliana Lopez";
    var descrip = "Acogedor apartamento en Suba";
    var precio = 10;
    var alcancia = 4;
    var pets = true;
    var kids = false;

    var arrendarInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log("datos enviados:");
      console.log(typeof nombre);
      console.log(typeof descrip);
      console.log(typeof precio);
      console.log(typeof alcancia);
      console.log(typeof pets);
      console.log(typeof kids);

      var account = accounts[0];

      App.contracts.Arrendar.deployed().then(function(instance) {
        arrendarInstance = instance;
        
        //Execute adopt as a transaction by sending account
        return arrendarInstance.arrendamiento(descrip, precio, alcancia, nombre, pets, kids, {from: account});
      }).then(function(result) {
        console.log("mostrandoDomo");
        
        return App.bindEvents();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  botonKleros: function(addr) {
    if (addr==="romperInv1"){
      culpable = dirs[0];
    } else {
      culpable = dirs[1];
    }

    $('#solConf').show();
    window.scrollTo(0,document.body.scrollHeight);
  },

  kleros: function() {
    condena = 0;
    //0 es inocente y 1 es culpable
    var j1 = Math.floor(Math.random() * 2);
    var j2 = Math.floor(Math.random() * 2);
    var j3 = Math.floor(Math.random() * 2);
    console.log("Jurados: "+j1+" "+j2+" "+j3);
    
    var arrendarInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        
        App.contracts.Arrendar.deployed().then(function(instance) {
          arrendarInstance = instance;

         

            arrendarInstance.getName.call({from: culpable}).then(function(res, err){
              if (err) {
                console.log(err);
              }

              nomCulpable=res;

              if(j1===0){
                $('#verd1').text("Inocente");
                $('#just1').text(res + " es inocente porque mi sexto sentido me lo dice.");
                condena++;
              } else {
                $('#verd1').text("Culpable");
                $('#just1').text(res + " es culpable porque es un opresor.");
              }  

              if(j2===0){
                $('#verd2').text("Inocente");
                $('#just2').text(res + " es inocente porque las evidencias en su contra fueron pocas.");
                condena++;
              } else {
                $('#verd2').text("Culpable");
                $('#just2').text(res + " es culpable porque las evidencias lo muestran.");
              }  

              if(j3===0){
                $('#verd3').text("Inocente");
                $('#just3').text(res + " es inocente porque no es su culpa la miserable vida que le tocó.");
                condena++;
              } else {
                $('#verd3').text("Culpable");
                $('#just3').text(res + " es culpable porque no quiso seguir los caminos de Dios.");
              }

            });
          
        }).then(function(result) {
          return App.bindEvents8();
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },

  bindEvents8: function() {
    console.log("mostrando Ver Veredicto");
    $('#verVered').show();
    $(document).on('click', '#verVered', App.finalKleros);
  },

  finalKleros: function() {
    $('#kleros').show();

    if(condena < 2){
      console.log("CULPABLE!");
      App.sancionarInvitado();
      $('#castigo').text("Debido a que los jurados de Kleros decidieron que "+nomCulpable+" es culpable, se le descontará 1 Ether de su respectiva parte de la alcancía.");
    } else {
      console.log("INOCENTE!");
      $('#castigo').text("Debido a que los jurados de Kleros decicieron que "+nomCulpable+" es inocente, no se verá afectada su parte de la alcancía.");
    }
    return $(document).on('click', '#finKleros', App.graciasKleros);
  },

  graciasKleros: function(){
    $('#infoDomo').hide();
    $('#preKleros').hide();
    $('#kleros').hide();
    $('#solConf').hide();
    $('#verVered').hide();
    $('#queja').val("");
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $( "#mostrar" ).click(function() {
    App.mostrarTodo();
  });

  $( "#romperInv1" ).click(function() {
    App.botonKleros(this.id);
  });

  $( "#romperInv2" ).click(function() {
    App.botonKleros(this.id);
  });

  $( "#solConf" ).click(function() {
    $('#preKleros').show();
    window.scrollTo(0,document.body.scrollHeight);
  });

  $( "#envKleros" ).click(function() {
    App.kleros();
  });
  
});
