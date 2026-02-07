// sample frequently bought items (replace with real product images)
const frequent = [
   { id: 1, title: 'Oil, Ghee & Masala', imgs: ['https://i.imgur.com/1Q9Z1Zz.png'] },
   { id: 2, title: 'Bread, Butter & Eggs', imgs: ['https://i.imgur.com/6Iej2c3.png', 'https://i.imgur.com/2nCt3Sbl.png'] },
   { id: 3, title: 'Vegetables & Fruits', imgs: ['https://i.imgur.com/DO7Yw2G.png'] },
   { id: 4, title: 'Milk, Curd & Paneer', imgs: ['https://i.imgur.com/Yv4hM6g.png'] },
   { id: 5, title: 'Cakes & Biscuits', imgs: ['https://i.imgur.com/2nCt3Sbl.png'] },
   { id: 6, title: 'Rajma, Chole & Dal', imgs: ['https://i.imgur.com/1Q9Z1Zz.png'] }
];


const host = window.location.host;

let prod_path_jsn = window.APP_CONFIG.productCatPath;
let subProd_path_jsn = window.APP_CONFIG.subCatPath;

//let host_Api=window.APP_CONFIG.hostApi;

let host_Api = "https://" + host;

const grid = document.getElementById('freqGrid');
frequent.forEach(f => {
   const d = document.createElement('div'); d.className = 'fcard';
   d.setAttribute("onclick", `showItom(${f.id})`);
   const more = document.createElement('div'); more.className = 'more'; more.textContent = '+4 more';
   const img = document.createElement('img'); img.src = f.imgs[0];
   const p = document.createElement('p'); p.textContent = f.title;
   d.appendChild(img);
   d.appendChild(more);
   d.appendChild(p);
   grid.appendChild(d);
});





// document.getElementById('profid_U5647').onclick = function(){
//    window.location.href = 'bl_profile.html';
//  }

function profid_U5647() {

   window.location.href = `/profile`;
}

//  this is for show itome function 
async function showItom(id) {
   document.getElementById("showItoms").style.display = "block";
   document.getElementById("mainp").style.display = "none";

   let sidebar_itb1224 = document.getElementById("sidebar_itb1224"); // sidebar_itb1224 its side bar manu
   let itbP121 = document.getElementById("itbP121"); // itbP121 its main contain to store itome

   sidebar_itb1224.replaceChildren();
   const res1 = await fetch(`${subProd_path_jsn}`);
   const files1 = await res1.json();
   // example id = 4; is dynamic
   let p = `cat_Id_${id}`;
   console.log("this cvalue is: ", p)
   console.log("this cvalue is: ", files1[p])
   for (const file1 of files1[p]) {

      const category = document.createElement("div");
      category.className = "category";
      category.innerHTML = create_PCartForSideShow(file1);
      sidebar_itb1224.appendChild(category);
   }
   // starttextvalue +=t2; // imprtant line for joining two part of html
   //   -----------------fetch json---------------------------------------------
   console.log("before check ", `${prod_path_jsn}${id}/aa_cat${id}.json`)

   const res = await fetch(`${prod_path_jsn}${id}/aa_cat${id}.json`);

   const files = await res.json();
   console.log("files is : " + res)

   itbP121.replaceChildren();
   Object.entries(files).forEach(([key, file]) => {

      let fileSplit_id = file.split("_")[2].split(".")[0]
      const fileRes = fetch(`${prod_path_jsn}${id}/${file}`);
      fileRes.then((d) => {
         let d1 = d.json();
         d1.then((data) => {

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = create_PCartForShow(data, fileSplit_id, id);
            itbP121.appendChild(card)
            //  itbP121.insertAdjacentHTML("beforeend",create_PCartForShow(data));

         })
      })

   });


   //   ----------------- end fetch json---------------------------------------------


}



// this is for main itome card create function   
let create_PCartForShow = (data, id, cat_id) => {

   let value = 0;

   return `
                <div class="card" onclick="showSingelItm('${data.product_name}_${data.id}_${id}.json' , '${cat_id}')">
                        <img src="${data.images[0]}">
                        <button class="add-btn"  onclick=" event.stopPropagation();  addToCart('${data.id}' , '${cat_id}')">ADD</button> 
                        <div class="weight">(  ${data.attributes[0].value})</div>
                        <div class="title">${data.product_name}</div>
                        <div class="discount">24% OFF</div>
                        <div class="price">₹${data.price} <span class="mrp">₹${data.mrp}</span></div>
                    </div>
                    `
}

// this is for side show itome card create function
let create_PCartForSideShow = (data) => {

   return `
                     <div class="category" onclick="showItom1(${data.cat_id},${data.id})">
                            <img src="${data.imgs[0]}">
                            <div class="title">${data.title}</div>

                     </div>
                    `
}

async function showItom1(cat_id, id) {
   document.getElementById("showItoms").style.display = "block";
   document.getElementById("bottom-nav").style.display = "none";
   document.getElementById("mainp").style.display = "none";


   let sidebar_itb1224 = document.getElementById("sidebar_itb1224"); // sidebar_itb1224 its side bar manu
   let itbP121 = document.getElementById("itbP121"); // itbP121 its main contain to store itome

   sidebar_itb1224.replaceChildren();
   const res1 = await fetch(`${subProd_path_jsn}`);
   const files1 = await res1.json();
   // example id = 4; is dynamic
   let p = `cat_Id_${cat_id}`;
   console.log("this cvalue is: ", p)
   // console.log("this cvalue is: ",files1[p])
   for (const file1 of files1[p]) {

      const category = document.createElement("div");
      category.className = "category";
      category.innerHTML = create_PCartForSideShow(file1);
      sidebar_itb1224.appendChild(category);
   }

   //   -----------------fetch json---------------------------------------------
   let str = `${prod_path_jsn}${cat_id}/aa_cat${cat_id}.json`;
   //const res = await fetch(`${prod_path_jsn}${id}/aa_cat${id}.json`);
   //console.log("Query is : "+str)
   const res = await fetch(str);

   const files = await res.json();
   //  console.log("files is : "+files[160704])

   itbP121.replaceChildren();
   for (const [key, file] of Object.entries(files)) {

      let fileSplit_id = file.split("_")[2].split(".")[0]; // geting id from file name


      if (fileSplit_id == id) {
         console.log(id + "fileSplit_id is file name:", `${prod_path_jsn}${cat_id}/${file}`);
         const fileRes = await fetch(`${prod_path_jsn}${cat_id}/${file}`);
         const data = await fileRes.json();

         const card = document.createElement("div");
         card.className = "card";
         card.innerHTML = create_PCartForShow(data, id, cat_id);
         itbP121.appendChild(card)

      }
   }

}


// for single product show logic 
async function showSingelItm(file, cat_id) {
   document.getElementById("showItoms").style.display = "none";
   document.getElementById("bottom-nav").style.display = "none";
   document.getElementById("mainp").style.display = "none";

   document.getElementById("sglPdShow").style.display = "block";

   let sglpshow_main = document.getElementById("sglpshow_main"); // sglpshow_main its single product show main contain
   let slidImg = document.getElementById("slider_sglpd");

   console.log("data is:", file);
   const fileRes = await fetch(`${prod_path_jsn}${cat_id}/${file}`);
   const data = await fileRes.json();
   let imgCon = document.getElementById("slider_sglpd");
   for (const img of data.images) {

      const imgEl = document.createElement("img");
      imgEl.src = img;
      imgCon.appendChild(imgEl);

   }
   document.getElementById("sglpd_nm").innerText = data.product_name;
   // set other product details as needed    
   document.getElementById("sglpd_rtg").innerText = "★★★★☆ (60,685)"; // example rating       
   document.getElementById("sglpd_price").innerText = "₹" + data.price; // example price
   document.getElementById("sglpd_mrp").innerText = "₹" + data.mrp; // example mrp
   document.getElementById("sglpd_qty").innerText = data.attributes[0].value; // example quantity
   let key_row2 = document.getElementById("key_row2");

   data.attributes.forEach(attr => {
      if (attr.type == "shown_to_customer") {
         attr.name; // attribute name
         let key_row_inner = document.createElement("div");
         key_row_inner.className = "key-row_inner";
         key_row_inner.innerHTML = `
                                  <span class="attr_name">${attr.name}</span>
                                  <span class="attr_value">${attr.value}</span>
                                  `;
         key_row2.appendChild(key_row_inner);

      }
   });

   document.getElementById("sglpd_add-btn").setAttribute("onclick", ` event.stopPropagation(); addToCart('${data.id}' , '${cat_id}')`);
   document.getElementById("sglpd_qty1").innerText = data.attributes[0].value;
   document.getElementById("sglpd_price1").innerText = "₹" + data.price;

   // 🔥 move cursor / view to top
   window.scrollTo({ top: 0, behavior: "smooth" });
}

// This is add to cart function
async function addToCart(Pid, cid) {


   alert("added to cart" + Pid);
   // Add to cart logic here
   // Example: Add item to cart in localStorage or send request to backend
   const cart = JSON.parse(localStorage.getItem("cart")) || [];
   const res1 = await fetch(`${prod_path_jsn}${cid}/aa_cat${cid}.json`);
   const files1 = await res1.json();

   const updatedCart = cart.filter(item => {
      console.log("item is : ", item);
      return item !== `${prod_path_jsn}${cid}/${files1[Pid]}`;
   });
   updatedCart.push(`${prod_path_jsn}${cid}/${files1[Pid]}`);

   localStorage.setItem("cart", JSON.stringify(updatedCart));

   // // Optionally, update cart UI or notify user
   //     console.log("fies is : " + files1[Pid])

   //                const fileRes = await fetch(`${prod_path_jsn}${cid}/${files1[Pid]}`);
   //                      const data = await fileRes.json();



}


let incQuent = (row) => {

   let price = document.getElementById(`priceCart${row}`).innerText;
   let price1 = Number.parseInt(price);

   let qunt = document.getElementById(`pr_count${row}`);
   let num = Number.parseInt(qunt.innerText);

   let tPrice = document.getElementById(`pr_tPrice${row}`);
   //    let t_price =Number.parseInt(tPrice.innerText);

   qunt.innerHTML = num + 1;
   tPrice.innerHTML = (num + 1) * price1;

   let totalP = 0
   let par = document.getElementById(`cartDM`);
   par.querySelectorAll(".pr_tPrice").forEach(ele => {

      totalP += Number.parseInt(ele.innerText);
   })
   document.getElementById("totalPriceCart").innerText = "Pay ₹ " + totalP;


}



let decQuent = (row, file) => {
   let price = document.getElementById(`priceCart${row}`).innerText;
   let price1 = Number.parseInt(price);

   let qunt = document.getElementById(`pr_count${row}`);
   let num = Number.parseInt(qunt.innerText);
   console.log("num is  - " + num);
   let tPrice = document.getElementById(`pr_tPrice${row}`);
   let t_price = Number.parseInt(tPrice.innerText);

   qunt.innerHTML = num - 1;
   tPrice.innerHTML = t_price - price1;

   let par = document.getElementById(`cartDM`);
   if (num <= 1) {
      //  deleteCartByCartId(cartId,row);
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = cart.filter(item => {
         console.log("item is : ", item);
         return item !== file;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      let child = document.getElementById(`itemCart${row}`);
      par.removeChild(child);

   }

   let totalP = 0
   let length = par.querySelectorAll(".itemCart").length;
   par.querySelectorAll(".pr_tPrice").forEach(ele => {

      totalP += Number.parseInt(ele.innerText);
   })
   document.getElementById("totalPriceCart").innerText = "Pay ₹ " + totalP;
   document.getElementById("headerCart").innerText = ` Basket (${length} items)`;


}


////  this is back function for view cart section
function goBack() {
   document.getElementById("bottom-nav").style.display = "flex";
   document.getElementById("mainp").style.display = "block";
   document.getElementById("sglPdShow").style.display = "none";

   document.getElementById("viewCart").style.display = "flex";

   document.getElementById("viewCartSection").style.display = "none";

}





// thsis open cart function
async function openCart() {
   document.getElementById("showItoms").style.display = "none";
   document.getElementById("bottom-nav").style.display = "none";
   document.getElementById("mainp").style.display = "none";
   document.getElementById("sglPdShow").style.display = "none";

   document.getElementById("viewCart").style.display = "none";

   document.getElementById("viewCartSection").style.display = "block";

   //  alert('Open cart (demo)'); 
   const cart = JSON.parse(localStorage.getItem("cart")) || [];
   let cartDM = document.getElementById("cartDM");

   cartDM.replaceChildren();
   let row = 1;
   let totalP = 0

   for (let iteme of cart) {

      let count = 1;
      let res = await fetch(iteme);
      let data = await res.json();

      console.log("row is : ", row)

      let itemCart = document.createElement('div');
      itemCart.className = "itemCart";
      itemCart.setAttribute("id", `itemCart${row}`);

      itemCart.innerHTML = `

                                    <img src="${data.images[0]}">
                                          <div class="item-detailsCart">
                                             <div class="item-titleCart">${data.product_name}</div>
                                             <div class="item-weightCart">${data.attributes[0].value}</div>
                                             <div class="priceCart" >₹
                                                         <span class="price_Cart" id="priceCart${row}">${data.price}</span>
                                                         
                                                         <span class="mrpCart">₹${data.mrp}</span></div>
                                          </div>
                                          <div class="qtyCart">
                                             <div class="pr_tPrice" id="pr_tPrice${row}">${data.price}</div>
                                             <div> 
                                                <button onclick="decQuent(${row}, '${iteme}')">-</button>
                                                <b class="pr_count" id="pr_count${row}">${count}</b>
                                                <button onclick="incQuent(${row})">+</button>
                                             </div>   
                                          </div>
                                    
                                    
                                    `
      cartDM.appendChild(itemCart);

      totalP += Number.parseInt(data.price);

      row++;

   }
   // https://www.google.com/maps/18.6822833,73.8151789
   getLocation();
   document.getElementById("headerCart").innerText = ` Basket (${cart.length} items)`;
   document.getElementById("totalPriceCart").innerText = "Pay ₹ " + totalP;
}

//  this is hide and show product information
function hideorShow(id) {
   let hideBtn = document.getElementById(id); // hideOrshowBtn its button to hide or show side bar
   if (window.getComputedStyle(hideBtn).display === "none") {
      hideBtn.style.display = "block";
   } else {
      hideBtn.style.display = "none";
   }
}

//   --------------------------  this is  Welcome Promt --------------------------------------------------------------------- 

let promptCallback = null;

let PromptText = () => {
   let chackPro = localStorage.getItem("id");

   const cart = JSON.parse(localStorage.getItem("cart")) || [];


   document.getElementById("vw_c").innerHTML = `${cart.length} item`;

   if (chackPro == null) {
      document.getElementById("welcomePage").style.display = "block";
   }
   else {
      document.getElementById("welcomePage").style.display = "none";
   }

}

function openPrompt(title, placeholder, callback) {
   document.getElementById("promptTitle").innerText = title;
   const input = document.getElementById("promptInput");
   input.value = "";
   input.placeholder = placeholder;

   promptCallback = callback;
   document.getElementById("promptOverlay").style.display = "flex";
   input.focus();
}

function submitPrompt() {
   const value = document.getElementById("promptInput").value.trim();
   sessionStorage.setItem(`id_${value}`, `${value}`)
   localStorage.setItem("id", value);
   closePrompt();
   // if (promptCallback) promptCallback(value);
}

function closePrompt() {
   document.getElementById("promptOverlay").style.display = "none";


}

PromptText();
//   --------------------------  this is  Welcome Promt --------------------------------------------------------------------- 

//------------------------------------------------location service -------------------------------------------------------------

function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let locationLink = document.getElementById("locationLink");
            locationLink.href = `https://maps.google.com/?q=${lat},${lon}`;

         },
         (error) => {
            alert("Location access denied or unavailable");
         }
      );
   } else {
      alert("Geolocation is not supported by this browser");
   }
}



if ("serviceWorker" in navigator) {
   console.log("Service Worker registered:");
   window.addEventListener("load", () => {
      navigator.serviceWorker.register("../scripts/sw.js")
         .then(reg => {
            console.log("Service Worker registered:", reg.scope);
         })
         .catch(err => {
            console.error("Service Worker registration failed:", err);
         });
   });
}


// ----------------------------Pay button-------------------------------------------------


document.getElementById("totalPriceCart").onclick = function () {

   setTimeout(() => {

   }, 3000)


   let itemCarts = document.querySelectorAll(".itemCart");
   let orders = [];

   let id = Math.random().toString(36).substring(2, 10);
   let order_id = id;
   let ids = localStorage.getItem("id");
   let date = Date.now();
   let totalPprice = Number(document.getElementById("totalPriceCart").innerText.substring(6, 9));
   let locationLink = document.getElementById("locationLink").getAttribute("href");


   for (const item of itemCarts) {
      const img = item.querySelector("img").src;
      const title = item.querySelector(".item-titleCart").innerText;
      const weight = item.querySelector(".item-weightCart").innerText;
      const price = item.querySelector(".price_Cart").innerText

      const mrp = Number(item.querySelector(" .mrpCart").innerText);
      const qty = Number(item.querySelector(".pr_count").innerText);
      const totalPprice = Number(item.querySelector(".pr_tPrice").innerText);
      orders.push({

         "img": img,
         "title": title,
         "weight": weight,
         "price": price,
         "mrp": mrp,
         "qty": qty,
         "totalPprice": totalPprice,
         "order_id": id


      })
      console.log(`Item: ${title}, Weight: ${weight}, Price: ${price}, Quantity: ${qty}`);

   }
   //  let valueData=JSON.stringify(orders);

   //const base64 = btoa(JSON.stringify(orders)); 
   //const base64=JSON.stringify(orders);


   // const decoded = JSON.parse(atob(base64));
   // console.log("Json object",decoded);
   const orderJ = JSON.parse(localStorage.getItem("order")) || [];
   console.log("data si : " + orderJ)
   orderJ.push(orders);



   let at = document.getElementById("totalPriceCart").innerText.substring(4, 9);
   alert(` This Is CASH ON Delevary  Please Ready Cash ${at} Order  Successful Order ID: ` + id);



   let Ord = `${host_Api}/app/v1/order`;
   console.log("Api is : " + Ord)

   const responce = new Request(Ord, {
      method: "post",
      body: JSON.stringify({
         "order_id": order_id,
         "id": id,
         "ids": ids,
         "date": date,
         "totalPprice": totalPprice,
         "location": locationLink,
         "status": "NOT-READY",
         "ordList": orders

      }),
      headers: {
         'Accept': 'application/json',
         'Content-type': 'application/json; charset=UTF-8'
         /*'Access-Control-Allow-Origin':"http://127.0.0.1:5500",
         Authorization : ``,
         "alg": "HS256",
         "typ": "JWT"*/
      }
   });

   fetch(responce).then((data) => {
      let d = data.json();
      d.then((value) => {

         localStorage.removeItem("cart");
         localStorage.setItem("order", JSON.stringify(orderJ));
      })
   })


}


























