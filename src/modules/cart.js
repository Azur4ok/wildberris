const Cart = () => {
const cartButton = document.querySelector(".button-cart"),
      cart = document.getElementById("modal-cart"),
      modalClose = document.querySelector(".modal-close"),
      goodsContainer = document.querySelector(".long-goods-list"),
      cartTable = document.querySelector(".cart-table__goods"),
      modalForm = document.querySelector(".modal-form"),
      modalFormNameCustomer = document.querySelector(".modal-form").children[0],
      modalFormPhoneNumber = document.querySelector(".modal-form").children[1];

let totalPrice = document.querySelector(".card-table__total");
document.querySelector(".card-table__total").textContent = 0;
      console.log(totalPrice);

    

const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.filter((good) => {
        return good.id !== id;
    })

    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
}

const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.map((good) => {
        if(good.id === id) {
            good.count++;
        }
        return good;
    })

    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
}

const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.map((good) => {
        if(good.id === id) {
            if(good.count > 1)
            good.count--;
        }
        return good;
    })

    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
}

const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem("goods"));
    const clickedGood = goods.find((good) => good.id === id);
    const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    if(cart.some((good) => good.id === clickedGood.id)) {
        cart.map((good) => {
            if(good.id === id) {
                good.count++;
            }
            return good;
        })
    } else {
        clickedGood.count = 1;
        cart.push(clickedGood);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

}

const renderCartGoods = (goods) => {
    cartTable.innerHTML = "";

    const finalPrice = [];

    goods.forEach(good => {
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${good.name}</td>
            <td>${good.price}$</td>
            <td><button class="cart-btn-minus"">-</button></td>
            <td>${good.count}</td>
            <td><button class=" cart-btn-plus"">+</button></td>
            <td>${+good.price * +good.count}</td>
            <td><button class="cart-btn-delete"">x</button></td>
        `
        finalPrice.push(`${+good.price * +good.count}`);

        cartTable.append(tr);

        tr.addEventListener("click", (e) => {
            if(e.target.classList.contains("cart-btn-minus")) {
                minusCartItem(good.id);
            } else if(e.target.classList.contains("cart-btn-plus")) {
                plusCartItem(good.id);
            } else if(e.target.classList.contains("cart-btn-delete")) {
                deleteCartItem(good.id);
            }
        })
    });
    
    totalPrice = finalPrice.reduce((prev, current) => prev + Number(current), 0);
    document.querySelector(".card-table__total").textContent = totalPrice;
}

const sendForm = () => {
    const cartArray = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        body: JSON.stringify({
            cart: cartArray,
            name: `${modalFormNameCustomer.value}`,
            phone: `${modalFormPhoneNumber.value}`
        })
    }).then(() => {
        cart.style.display = "";
        modalFormNameCustomer.value = "";
        modalFormPhoneNumber.value = "";
        localStorage.removeItem("cart");
    })
}

modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm()
})

cartButton.addEventListener("click", () => {
    cart.style.display = "flex";
    const cartArray = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    renderCartGoods(cartArray);
})

modalClose.addEventListener("click", () => {
    cart.style.display = "";
})

if(goodsContainer) {
    goodsContainer.addEventListener("click", (e) => {
        if(e.target.closest(".add-to-cart")) {
            const buttonToCart = e.target.closest(".add-to-cart");
            const goodId = buttonToCart.dataset.id;
            addToCart(goodId);
        }
    })
}

}

export default Cart;
