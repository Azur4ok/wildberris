const getGoods = () => {

    const links = document.querySelectorAll(".navigation-link");
    const more = document.querySelector(".more");

    const renderGoods = (goods) => {
        const goodsContainer = document.querySelector(".long-goods-list");
        goodsContainer.innerHTML = "";

        goods.forEach(good => {
            const goodBlock =   document.createElement("div");
            goodBlock.classList.add("col-lg-3");
            goodBlock.classList.add("col-sm-6");
            goodBlock.innerHTML = `
                    <div class="goods-card">
						<span class="label ${good.label ? null : "d-none"}">${good.label}</span>
						<img src="db/${good.img}" alt="image: Hoodie" class="goods-image">
						<h3 class="goods-title">${good.name}</h3>
						<p class="goods-description">${good.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${good.id}">
							<span class="button-price">$${good.price}</span>
						</button>
					</div>
            `

            goodsContainer.append(goodBlock);
        });
    }

    const getData = (value, category)=> {
        fetch('db/db.json')
        .then((response) => response.json())
        .then((data) => {
            const array = category ? data.filter((item) => item[category] === value) : data;

        if(window.location.pathname !== '/goods.html') {
            window.location.href = '/goods.html';
        } else {
            renderGoods(array);
        }

            localStorage.setItem("goods", JSON.stringify(array));
            //JSON.parse(localStorage.getItem("goods"));
        })
    }

    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const linkValue = link.textContent;
            const category = link.dataset.field;    

            getData(linkValue, category);
        })
    })

    if(localStorage.getItem("goods") && window.location.pathname === '/goods.html') {
        renderGoods(JSON.parse(localStorage.getItem("goods")));
    }

    if(more) {
        more.addEventListener("click", (e) => {
            e.preventDefault();    

            getData();
        });
    }
    
}

export default getGoods;