$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'https://api-gamma-seven.vercel.app/api';
const currentUser = localStorage.getItem('user');
const MQTT_URL = 'https://api-taupe.vercel.app/send-command';
const fridges = JSON.parse(localStorage.getItem('fridges')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

$.get('/auth/google/user', (res) => {
  const logGoogle = localStorage.getItem('logGoogle');
  console.log("Log google is apparently " + logGoogle);
  if (logGoogle) {
    console.log("This is true");
    localStorage.setItem('user', res.name);
    localStorage.setItem('isAdmin', res.isAdmin);
    localStorage.setItem('isAuthenticated', true);
  }
});

if (currentUser) {
  console.log(currentUser)
  $.get(`${API_URL}/fridges`)
    .then(response => {
      response.forEach((fridge) => {
        $('#fridges tbody').append(`
          <tr data-fridge-id=${fridge._id}>
          <td>${fridge.storeId}</td>
          <td>${fridge.FridgeId}</td>
          <td>${fridge.Fridgename}</td>
          </tr>`
        );
      });
      $('#fridges tbody tr').on('click', (e) => {
        const fridgeId = e.currentTarget.getAttribute('data-fridge-id');
        $.get(`${API_URL}/fridges/${fridgeId}/fridge-history`)
          .then(response => {
            response.map(temperatureData => {
              $('#historyContent').append(`
              <tr>
                <td>${temperatureData.time}</td>
                <td>${temperatureData.temperature}</td>'
              </tr>
            `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
}
else if (localStorage.getItem('logGoogle')) {
  console.log(currentUser)
  $.get(`${API_URL}/fridges`)
    .then(response => {
      response.forEach((fridge) => {
        $('#fridges tbody').append(`
          <tr data-fridge-id=${fridge._id}>
          <td>${fridge.storeId}</td>
          <td>${fridge.FridgeId}</td>
          <td>${fridge.Fridgename}</td>
          </tr>`
        );
      });
      $('#fridges tbody tr').on('click', (e) => {
        const fridgeId = e.currentTarget.getAttribute('data-fridge-id');
        $.get(`${API_URL}/fridges/${fridgeId}/fridge-history`)
          .then(response => {
            response.map(temperatureData => {
              $('#historyContent').append(`
              <tr>
                <td>${temperatureData.ts}</td>
                <td>${temperatureData.temp}</td>'
              </tr>
            `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
}
else {
  const path = window.location.pathname;
  if (path !== '/login' && path !== '/registration') {
    location.href = '/home1';
  }
}


$('#fridge-graph').on('click', () => {
  $.get(`${API_URL}/fridges/temperatureData`)
  $('#graph').append(`
  
  <a href="https://plotly.com/~avneetsag/8/?share_key=znpdfe6K3frfckunvLQX4x" target="_blank" title="fridgess" style="display: block; text-align: center;"><img src="https://plotly.com/~avneetsag/8.png?share_key=znpdfe6K3frfckunvLQX4x" alt="fridgess" style="max-width: 100%;width: 600px;"  width="600" onerror="this.onerror=null;this.src='https://plotly.com/404.png';" /></a>
  <script data-plotly="avneetsag:8" sharekey-plotly="znpdfe6K3frfckunvLQX4x" src="https://plotly.com/embed.js" async></script>



 
       `)
});


async function getStores() {
  const res = await fetch('http://localhost:5000/api/stores');

  const data = await res.json();

  const stores = data.map(store => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          store.location.coordinates[0],
          store.location.coordinates[1]
        ]
      },
      properties: {
        storeId: store.storeId,
        icon: 'shop'
      }
    };
  });

  loadMap(stores);
}
// Load map with stores
function loadMap(stores) {
  map.on('load', function () {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stores
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{storeId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}
getStores();
/** 
$.get(`${API_URL}/fridges`)
  .then(response => {
    response.forEach(fridge => {
      $('#fridges tbody').append(`
 <tr>
 <td>${fridge.name}</td>
 <td>${fridge.StoreId}</td>
 <td>${fridge.FridgeId}</td>
 <td>${fridge.Fridgename}</td>
 </tr>`
      );
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });*/


/**$('#articles').on('click', (e) => {
  console.log("clicked #articles")
});

$('#articles tbody').on('click', (e) => {
  console.log("clicked #articles tbody")
});*/
$('#add-fridge').on('click', () => {
  const storeId = $('#storeId').val();
  const FridgeId = $('#FridgeId').val();
  const Fridgename = $('#Fridgename').val();
  const temperatureData = [];
  const body = {
    storeId,
    FridgeId,
    Fridgename,
    temperatureData
  };
  $.post(`${API_URL}/fridges`, body)
    .then((response) => {
      if (response.success) {
        location.href = '/register-list';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
})

$.get(`${API_URL}/stores`)
  .then(response => {
    response.forEach(store => {
      $('#stores tbody').append(`
 <tr>
 <td>${store.storeId}</td>
 <td>${store.location.formattedAddress}</td>
 </tr>`
      );
    });
  })

$('#submission').on('click', () => {
  const storeId = $('#storeId').val();
  const ArticleId = $('#ArticleId').val();
  console.log(storeId)
  console.log(ArticleId)

  $.post(`${API_URL}/stores/articles`, { storeId, ArticleId })
    .then(response => {
      console.log(response.storeId)
      console.log(response.ArticleId)
      console.log(response.ArticlePrice)
      console.log(response.Articlelocation)
      $('#articles tbody').append(`
       <tr>
       <td>${response.storeId}</td>
       <td>${response.ArticleId}</td>
       <td>${response.ArticlePrice}</td>
       <td>${response.Articlelocation}</td>
       </tr>`
      );
    });

})



$('#send-command').on('click', function () {
  const driverId = $('#driverId').val();
  const command = $('#command').val();

  $.post(`${MQTT_URL}`, { driverId, command })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});


$('#register').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();
  if (password !== confirm) {
    $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
  } else {
    $.post(`${API_URL}/register`, { user, password })
      .then((response) => {
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
  }
});

$('#add-article').on('click', () => {
  const storeId = $('#storeId').val();
  const ArticleId = $('#ArticleId').val();
  const ArticlePrice = $('#ArticlePrice').val();
  const Articlelocation = $('#Articlelocation').val();
  $.post(`${API_URL}/stores/article2`, { storeId, ArticleId, ArticlePrice, Articlelocation })
    .then((response) => {
      if (response.success) {
        location.href = '/article_lookup';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});

$('#save').on('click', () => {
  const storeId = $('#store-id').val();
  const address = $('#store-address').val();
  $.post(`${API_URL}/stores`, { storeId, address })
    .then((response) => {
      if (response.success) {
        location.href = '/store-list';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});

$('#update').on('click', () => {
  const storeId = $('#storeId').val();
  const ArticleId = $('#ArticleId').val();
  const ArticlePrice = $('#ArticlePrice').val();
  $.post(`${API_URL}/stores/article3`, { storeId, ArticleId, ArticlePrice })
    .then((response) => {
      if (response.success) {
        location.href = '/article_lookup';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});

$('#updates').on('click', () => {
  const storeId = $('#storeId').val();
  const ArticleId = $('#ArticleId').val();
  const Articlelocation = $('#Articlelocation').val();
  $.post(`${API_URL}/stores/article4`, { storeId, ArticleId, Articlelocation })
    .then((response) => {
      if (response.success) {
        location.href = '/article_lookup';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});

$('#deletes').on('click', () => {
  const storeId = $('#delete').val();
  $.post(`${API_URL}/stores/delete`, { storeId })
    .then((response) => {
      if (response.success) {
        $.post(`${API_URL}/fridges/delete`, { storeId })
          .then((response) => {
            if (response.success) {
              $.post(`${API_URL}/article/delete`, { storeId })
              if (response.success) {
                location.href = '/store-list';
              } else {
                $('#message').append(`<p class="alert alert-danger">${response}</p>`);
              }
            }
            else {
              $('#message').append(`<p class="alert alert-danger">${response}</p>`);
            }
          })
      }
      else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    })
});

$('#remove').on('click', () => {
  const storeId = $('#removestore').val();
  const FridgeId = $('#removefridge').val();
  $.post(`${API_URL}/stores/fridge/delete`, { storeId, FridgeId })
    .then((response) => {
      if (response.success) {
        location.href = '/register-list';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});



$('#removed').on('click', () => {
  const storeId = $('#removestore').val();
  const ArticleId = $('#removearticle').val();
  $.post(`${API_URL}/stores/article/delete`, { storeId, ArticleId })
    .then((response) => {
      if (response.success) {
        location.href = '/article_lookup';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
      }
    });
});

$('#submit').on('click', function () {
  const driverId = $('#driverId').val();
  const command = $('#command').val();

  $.post(`${MQTT_URL}`, { driverId, command })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});

/**$('#remove').on('click', () => {
  const storeId = $('#removefridge').val();
  $.post(`${API_URL}/fridges/delete`, storeId)
     location.href = '/register-list';
});*/
$('#login').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) => {
      if (response.success) {
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        location.href = '/home2';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}
   </p>`);
      }
    });
});
$('#logingoogle').on('click', (req, res) => {
  localStorage.setItem('logGoogle', true);
  location.href = '/auth/google';
});
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('is Authenticated');
  localStorage.removeItem('logGoogle');
  location.href = '/home1';
}
