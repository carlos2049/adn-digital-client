const list = document.getElementById('list');
const popupSend = document.getElementById('popup-1');
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let action = false;
let idPerrito = 0;

document.addEventListener('DOMContentLoaded', function () {
  fetching();
});

list.addEventListener('click', (e) => {
  btnAccion(e);
});

popupSend.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = e.target.querySelectorAll('input')[0].value;
  const color = e.target.querySelectorAll('input')[1].value;
  const raza = e.target.querySelectorAll('input')[2].value;

  const datos = {
    nombre,
    color,
    raza,
  };
  if (action === false) {
    crearPerrito(datos);
  } else {
    actualizarPerrito(datos);
  }
});

const btnAccion = (e) => {
  if (e.target.classList.contains('btn-info')) {
    togglePopuup();
    idPerrito = e.target.dataset.id;
    action = true;
  }

  if (e.target.classList.contains('btn-danger')) {
    eliminarPerrito(e.target.dataset.id);
  }
  e.stopPropagation();
};

const actualizarPerrito = async (data) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/perritos/${idPerrito}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });
    fetching();
    togglePopuup();

    action = false;
  } catch (error) {
    console.log(error);
    action = false;
  }
};

const crearPerrito = async (data) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/perritos`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    response = await res.json();
    console.log(response);
    if (response.success === false) {
      alert(response.message);
    }
    fetching();
    togglePopuup();
  } catch (error) {
    console.log(error);
  }
};

const eliminarPerrito = async (id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/perritos/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    fetching();
  } catch (error) {
    console.log(error);
  }
};

const fetching = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/perritos`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const data = await res.json();
    const perritos = data.data;

    list.innerHTML = '';

    Object.values(perritos).forEach((perrito, i) => {
      console.log(i);
      templateCarrito.querySelectorAll('td')[0].textContent = i + 1;
      templateCarrito.querySelectorAll('td')[1].textContent = perrito.nombre;
      templateCarrito.querySelectorAll('td')[2].textContent = perrito.color;
      templateCarrito.querySelectorAll('td')[3].textContent = perrito.raza;
      console.log(templateCarrito);

      templateCarrito.querySelector('.btn-danger').dataset.id = perrito.id;
      templateCarrito.querySelector('.btn-info').dataset.id = perrito.id;

      const clone = templateCarrito.cloneNode(true);
      fragment.appendChild(clone);
    });
    list.appendChild(fragment);
  } catch (error) {
    console.log(error);
  }
};

function togglePopuup() {
  document.getElementById('popup-1').classList.toggle('active');
}
