




// ======= Basic app state using localStorage =======
const STORAGE_KEY = 'clothstore-data-v1'

const host = window.location.host;

//   alert("window pop up "+host)
let prod_path_jsn = window.APP_CONFIG.productCatPath;
let subProd_path_jsn= window.APP_CONFIG.subCatPath;
let host_Api="https://"+host;
let soundPath= window.APP_CONFIG.soundPath;

 if(localStorage.getItem("picker_id") == null){
      let id= window.prompt("enter mobile number") ;
       let urlApi=host_Api+"/pid/"+id;
        const responce= new Request(urlApi,{
              "method":"get"
            })
                fetch(responce).then((data)=>{
                      let d=	data.json();  
                      d.then((value)=>{
                            if(value.msg == "No Picker Found"){
                                  alert("No Picker Found");
                                  localStorage.removeItem("picker_id"); 
                                  window.location.reload();

                            }
                            else{
                                  alert("Welcome "+ value.pickerName +" id : "+value.pickerId);
                                  localStorage.setItem("picker_name",value.pickerName);
                                  localStorage.setItem("picker_id",id);
                                  //localStorage.setItem("picker_status",value.pickerStatus);
								  updPikerStatus(id,"online")

                                  document.getElementById("peckerId").innerHTML= value.pickerName;

                            }

                      })
                    
                    })

 }
 else{
	//  document.getElementById("popupOverlay").style.display="block";
 }




// const STORAGE_KEY = 'products'
const defaultState = { products: [], customers: [] }
function readState() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : structuredClone(defaultState) } catch (e) { console.error(e); return structuredClone(defaultState) }
}
function writeState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }
let state = readState()



// ======= UI navigation =======
document.querySelectorAll('#sidebar .nav-item').forEach(el => el.addEventListener('click', () => { setView(el.dataset.view) }))
document.querySelectorAll('[data-action="goto"]').forEach(b => b.addEventListener('click', e => setView(e.currentTarget.dataset.target)))

function setView(view) {
    document.querySelectorAll('#sidebar .nav-item').forEach(n => 
                    n.classList.toggle('active', n.dataset.view === view))
    document.querySelectorAll('main .card').forEach(s =>{

       if (s.className=="summary card" || s.className=="card card_search") {
        s.style.display = 'block'
       } 
       else if(s.className=="newOrderRes" ){
                       
       }
       else {
        
           s.style.display = 'none'
       }
       
         })
         console.log("value is : "+view)
    const id = 'view-' + view
    const el = document.getElementById(id)
    if (el) el.style.display = 'block'
    // update stats
    document.getElementById('stat-count').textContent = state.products.length
    renderInventory()
    
    if(view=="NewOrder"){
             newOrd(view);
    }
}

// initial view
setView('dashboard')

// ======= Add Product =======
document.getElementById('save-product').addEventListener('click', () => {
    const name = document.getElementById('p-name').value.trim()
    const sku = document.getElementById('p-sku').value.trim()
    const price = parseFloat(document.getElementById('p-price').value) || 0
    const cost = parseFloat(document.getElementById('p-cost').value) || 0
    const size = document.getElementById('p-size').value
    const qty = parseInt(document.getElementById('p-qty').value) || 0
    if (!name || !sku) { alert('Please enter name and SKU'); return }
    // check unique sku
    if (state.products.some(p => p.sku === sku)) { 
                if (!confirm('SKU already exists — add quantity to existing product?')) 
                        return; 
            const existing = state.products.find(p => p.sku === sku);
            existing.qty += qty; writeState(state); 
            clearAddProduct(); 
            renderInventory(); 
            return 
        }
    const product = { sku, name, size, price, cost, qty }
    state.products.push(product)
    writeState(state)
    clearAddProduct()
    renderInventory()
    alert('Saved')
})


function clearAddProduct() {
    ['p-name', 'p-sku', 'p-price', 'p-cost', 'p-qty'].forEach(id => document.getElementById(id).value = '')
}





// ======= Inventory UI =======
//  const tableBody = document.getElementById('#inv-table');

function renderInventory(filter = '') {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log('renderInventory called with filter:', filter)
    const invTable = document.getElementById('inv-table')
    const f = filter.toLowerCase()

    const rows = products.filter(p => p.name.toLowerCase().includes(f) || p.sku.toLowerCase().includes(f))
    invTable.innerHTML = rows.map((p, i) =>
        `<tr>
            <td>${p.sku}</td>
            <td>${p.name}</td>
            <td>${p.category || '-'}</td>
            <td>${p.size || '-'}</td>
            <td>${p.colour || '-'}</td>
            <td>₹${p.purchasePrice}</td>
            <td>₹${p.price}</td>
            <td>${p.qty}</td>
            <td>${p.brand || '-'}</td>
            <td class="actions">
              <button class="btn-edit" onclick="editProduct(${i})">Edit</button>
              <button class="btn-delete" onclick="deleteProduct(${i})">Delete</button>
            </td>
          </tr>
            `).join('')
    document.getElementById('inv-count').textContent = rows.length
    document.getElementById('stat-count').textContent = state.products.length
    // attach events
    invTable.querySelectorAll('button.del')
        .forEach(b => b.addEventListener('click', e => {
            const sku = e.currentTarget.dataset.sku;
            if (confirm('Delete ' + sku + '?')) {
                state.products = state.products.filter(x => x.sku !== sku);
                writeState(state); renderInventory()
            }
        }))
    invTable.querySelectorAll('button.edit')
        .forEach(b => b.addEventListener('click', e => {
            const sku = e.currentTarget.dataset.sku;
            const p = state.products.find(x => x.sku === sku);
            if (!p) return;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-sku').value = p.sku;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-cost').value = p.cost;
            document.getElementById('p-qty').value = p.qty;
            setView('add-product')
        }))
}


// ======= Inventory UI =======
// -----------------------------------------------------
//  let products = JSON.parse(localStorage.getItem('products') || '[]');
//  const tableBody = document.getElementById('#inv-table');

//  const renderInventory = () => {
//       const q = document.getElementById('inv-search').value.toLowerCase();
//       tableBody.innerHTML = products
//         .filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
//         .map((p, i) => `
//           <tr>
//             <td>${p.sku}</td>
//             <td>${p.name}</td>
//             <td>${p.category || '-'}</td>
//             <td>${p.size || '-'}</td>
//             <td>${p.colour || '-'}</td>
//             <td>₹${p.price}</td>
//             <td>${p.qty}</td>
//             <td>${p.brand || '-'}</td>
//             <td class="actions">
//               <button class="btn-edit" onclick="editProduct(${i})">Edit</button>
//               <button class="btn-delete" onclick="deleteProduct(${i})">Delete</button>
//             </td>
//           </tr>
//         `).join('');
//     };

 // ======= Inventory UI =======
 // --------------------End logic---------------------------------
document.getElementById('inv-search').addEventListener('input', e => renderInventory(e.target.value))






function genBill(){
}



// ======= Billing cart logic =======
let cart = []
function renderCart() {
    console.log('renderCart called')
  

    const tbody = document.querySelector('#cart-table tbody')
    tbody.innerHTML = cart.map((it, idx) =>
        `<tr>
                  <td>${escapeHtml(it.name)}</td>
                  <td>${(it.sku)}-${(it.colour)}</td>
                  <td><input data-idx="${idx}" class="qty" value="${it.qty}" style="width:60px" /></td>
                  <td><input data-idx="${it.price}" class="qty" value="${it.price}" style="width:60px" /></td>
                  <td>₹${(it.price * it.qty).toFixed(2)}</td>
                  <td><button class="ghost remove" data-idx="${idx}">x</button></td>
            </tr>`).join('')
    document.getElementById('cart-count').textContent = cart.length
    // qty events
    tbody.querySelectorAll('input.qty').forEach(inp =>
        inp.addEventListener('change', e => {
            const i = +e.target.dataset.idx;
            const v = parseInt(e.target.value) || 1; cart[i].qty = v;
            renderCart()
        }))
    tbody.querySelectorAll('button.remove').forEach(b =>
        b.addEventListener('click', e => {
            cart.splice(+e.currentTarget.dataset.idx, 1);
            renderCart()
        }))

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(2)
    const disc = parseFloat(document.getElementById('discount').value) || 0
    const total = Math.max(0, subtotal - disc)
    document.getElementById('total').textContent = '₹' + total.toFixed(2)
    
    const advPay = parseFloat(document.getElementById('advPay').value) || 0
    const rem_total = Math.max(0, total - advPay)
    document.getElementById('rem_total').textContent = '₹' + rem_total.toFixed(2)    

}






function addproductFuntion(data){
    const item = { 
                      productId: data.productId,
                      sku: data.sku, 
                      name: data.name, 
                      price: data.price, 
                      size: data.size,
                      colour: data.colour,
                      cost: data.cost, 
                      qty: 1 
                }
    cart.push(item)
    renderCart()
}


// ----------------------LogIn  LogOut Function----------------------=========================

document.getElementById("Logout").addEventListener('click',()=>{
	   updPikerStatus(localStorage.getItem("picker_id") , "offline");
      localStorage.removeItem("picker_id");
      alert("Logout Done : ");
      localStorage.removeItem("picker_name");
    //localStorage.removeItem("picker_status");
	
	
     window.location.reload();


})

// ======================================================================




// ======= Barcode / QR scanning (Browser API with fallback) =======
let stream = null, videoTrack = null
const video = document.getElementById('video')
async function startCamera() {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
	   alert("Camera API not available. Use HTTPS.");
	   return;
	 }
   
	  stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    video.srcObject = stream
    video.play()
    const tracks = stream.getVideoTracks()
    videoTrack = tracks[0]


        let scanQRApi=`${host_Api}/app/v1/scanQrCode`;

        const responce= new Request(scanQRApi,{
            method:"get",
            headers:{
                // 'Accept' : 'application/json',
                // 'Content-type': 'application/json; charset=UTF-8',
                // 'Access-Control-Allow-Origin':"http://127.0.0.1:5500",
                // Authorization : `Bearer ${token}`,
                // "alg": "HS256",
                // "typ": "JWT"
            }
        });
            fetch(responce) 
                            .then((responce)=>{
                               let  j= responce.json();
                                j.then((data)=>{
                                   alert("product Csanned Successfully");
                                    console.log("Response : "+ data);
                                    
                                    // scanProductFuntion(data);
                                     
                                     
                                }
                            )
                            })
                            .catch((err)=>{
                                console.log("Error"+ err);
                            });


}


  function start_scan(d){

            startCamera();

      
      }

function stopCamera() { 
    if (stream) {
         stream.getTracks().forEach(t => 
            t.stop()); 
            stream = null; 
            video.srcObject = null 
        } 
    }


document.getElementById('start-scan').addEventListener('click', startCamera)
document.getElementById('stop-scan').addEventListener('click', stopCamera)
document.getElementById('fileInput').addEventListener('change', async e => {
                 const f = e.target.files[0]; 
                 if (!f) return; // we could try to decode with libraries; for now, show filename
    document.getElementById('detected').textContent = 'Image selected: ' + f.name
    })

// ======= Import some demo data helper (if inventory empty) =======
if (state.products.length === 0) {
    state.products.push({ sku: 'TSHIRT-BLU-M', name: 'T-Shirt Blue', size: 'M', colour: "red" , price: 399, cost: 150, qty: 12 })
    state.products.push({ sku: 'JEANS-32', name: 'Denim Jeans', size: '32', price: 1199, cost: 500, qty: 8 })
    state.products.push({ sku: 'SHIRT-WHT-L', name: 'Formal Shirt White', size: 'L', price: 799, cost: 300, qty: 6 })
    writeState(state)
}
// renderInventory(); 

//  renderCart()



// ======= Utility =======
function escapeHtml(s) {
     return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') 
    }







   // make QR code for picker new product     
        document.getElementById('makeQr').addEventListener('click', ()=>{
            window.location.href = `${host_Api}/pickerProductPage`;

        })

        



//    ---------------- new  Orders ................ ------------------------  
// document.getElementById("ord").addEventListener('click',()=>{

//                 // renderTable(list)
// 				console.log("this is ot ");
//                 document.getElementById("neworder").style.display="block";

//               document.getElementById("ordersTable1").insertAdjacentHTML("beforeend", `
//                             <tr>
//                                 <td>ugmrc123</td>
//                                 <td>27/Jan/2025</td>
//                                 <td>Krushna</td>
//                                 <td>4</td>
//                                 <td>₹1070</td>
//                                 <td>Not Ready</td>
//                             </tr>
//                             `);
// })

let newOrd =(view) =>{
				
            				let newOrdUrl=`${host_Api}/app/v1/neworders`
			            const responce= new Request(newOrdUrl,{
							              method:"get",
			                               headers:{
							                  'Accept' : 'application/json',
							                  'Content-type': 'application/json; charset=UTF-8'
			                                }
			                            })
										
                                        fetch(responce).then((data)=>{
                                                let d=	data.json();
                                                d.then((value)=>{
                                                     document.getElementById("ordersTable12").innerHTML="";
                                                    if(view=="NewOrder"){
                                                    value.forEach(e => {
                                                        
                                                        // timeAgo(1768826809521)
                                                        console.log( "time is : "+ timeAgo(e.date))
                                                            document.getElementById("ordersTable12").insertAdjacentHTML("beforeend", `
                                                                               <tr>
                                                                                   <td>${e.order_id}</td>
                                                                                   
                                                                                   <td>${e.ids}</td>
                                                                                   <td>${e.ordList.length}</td>
                                                                                   <td>₹${e.totalPprice}</td>
                                                                                   <td>${e.status}</td>
																				   <td class="timeAgo" data-date="${e.date}">
																				         ${timeAgo(e.date)}
																				    </td>
																				   <td> <button onClick="viewsA('${e.order_id}')"> VIEW </button> </td>
                                                                               </tr>
                                                                               `);

                                                        
                                                    });
                                                }

                                                    else{
                                                           document.getElementById("ord").innerHTML=`⚙️ Orders(${value.length})`;
                                                    }
                                                })
                                  });
										
										
                       




        }

        // newOrd(null);




		function timeAgo(timestamp) {
		  const diff = Date.now() - timestamp;

		  if (diff < 0) {
		    return { text: "In the future", level: "normal" };
		  }

		  const sec = Math.floor(diff / 1000);
		  if (sec < 60) {
		    return { text: `${sec} sec ago`, level: "normal" };
		  }

		  const min = Math.floor(sec / 60);
		  if (min < 3) {
		    return { text: `${min} min ago`, level: "warning" };
		  }

		  if (min >= 3) {
		    return { text: `${min} min ago`, level: "danger" };
		  }

		  const hr = Math.floor(min / 60);
		  if (hr < 24) {
		    return { text: `${hr} hours ago`, level: "danger" };
		  }

		  const day = Math.floor(hr / 24);
		  return { text: `${day} days ago`, level: "danger" };
		}

setInterval(() => {
	document.querySelectorAll(".timeAgo").forEach(td => {
	    const date = Number(td.dataset.date);
	    const result = timeAgo(date);

	    td.innerText = result.text;

	    // reset classes
	    td.classList.remove("normal", "warning", "danger");

	    // apply class
	    td.classList.add(result.level);
	
		  });
		}, 1000);
	
    
setInterval(() => {
			
			const popup = document.getElementById("popupOverlay");

			if (window.getComputedStyle(popup).display === "none") {
			    viewsA();
			
        }
},2000)
    
function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

function ordAcseptBTN(id) {
          document.getElementById("ordAbtn").style.display = "none"; 
          document.getElementById("popupContent").style.pointerEvents = "all"; 
          setTimeout(() => {
                  updOrderStatus(id,"Prosessing");
				  updPikerStatus(localStorage.getItem("picker_id"), "picking")
                  document.getElementById("ordDBTN").style.display = "block"; 
            
          },2000)
}

const audio = new Audio(`${soundPath}/tada.mp3`);

function unlockAudio() {
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
    });
    document.removeEventListener("click", unlockAudio);
}

document.addEventListener("click", unlockAudio);




function ordDBTN(id) {
      updOrderStatus(id,"READY");
	  updPikerStatus(localStorage.getItem("picker_id"), "online")
     document.getElementById("popupOverlay").style.display = "none"; 
	 window.location.reload();
}  




// this function update order status
function updOrderStatus(id,status){
      let url=`${host_Api}/app/v1/updateOrderStatus/${id}/${status}`;
              const responce= new Request(url,{
                                method:"put"
              })
                  fetch(responce).then((data)=>{
                        let d=	data.json();  
                  });
}

// this function update Picker status
// call from picker controller
function updPikerStatus(pickerid,status){
      let url=`${host_Api}/statusUpd/${pickerid}/${status}`;
              const responce= new Request(url,{
                                method:"put"
              })
                  fetch(responce).then((data)=>{
                        let d=	data.json();  
                  });
}


let viewsA=()=>{
	//console.log("inside viewsA")
						let OrdUrl=`${host_Api}/app/v1/newOrder`;

	                           const responce= new Request(OrdUrl,{
					              method:"get",
	                               headers:{
					                  'Accept' : 'application/json',
					                  'Content-type': 'application/json; charset=UTF-8'
	                                }
	                            })	
								
								fetch(responce).then((data)=>{
                 
		                                let d=	data.json();
                                  
										d.then((map)=>{
											
                          if(map.msg == "No Order"){
                                  document.getElementById("popupOverlay").style.display="none";
                          }
                          else{
                              document.getElementById("popupOverlay").style.display="block";
                          let value=map.order;

                           let tada= document.getElementById("tada");
                           tada.setAttribute("src",`${soundPath}/tada.mp3`);
                           tada.muted = true;
                            tada.play();

                                            document.getElementById("popupOverlay").style.display = "flex";
                                            let content="";
                                           let qnt=0;
		                                    
                                          for (const e of value.ordList) {
                                           
                                                    content= content+`
                                                        <div class="inPonC">
                                                        <div>
                                                            <img style="width: 100px; height: 100px;" src="${e.img}" alt="">
                                                        </div>
                                                        <div class="inPonD">
                                                                <h4> <span> ${e.qty}X </span> ${e.title}  </h4>
                                                                <h4> ${e.weight}</h4> 
                                                                
                                                                <img id="img_${e.ordLid}" style="width: 20px; height: 20px;" src="https://www.citypng.com/public/uploads/preview/hd-green-mark-tick-symbol-icon-sign-png-701751695051738x2kpqds6js.png" alt="">
                                                                
                                                                <button class="btn" id="btn_${e.ordLid}" onclick="startScan('${e.ordLid}')">Scan QR</button>
                                                                  <video id="video_${e.ordLid}" autoplay playsinline  muted
                                                      style="width:57%;height:36%; display: none;"></video>
                                                                  <canvas id="canvas" hidden></canvas>

                                                                  <p id="result"></p>
                                                              
                                                        </div>
                                                    </div>
                                                                            `
                                                qnt=qnt+e.qty;
												 }
                         document.getElementById("ordcountPGV").innerHTML=` New  Order <span id="ordcountPGV"> (${qnt} ) </span>`;
                         document.getElementById("popupContent").innerHTML = content;

                         document.getElementById("ordAbtn").setAttribute("onclick",`ordAcseptBTN('${value.order_id}')`);
                         document.getElementById("ordDBTN").setAttribute("onclick",`ordDBTN('${value.order_id}')`);

                         }
											}) 
                      .catch((error)=>{
                        console.log("Error is : "+error);
                      })
										})
										
									
				}		
//viewsA();
// End of picker_min.js


// ???????????????????????????????????????????????????
// ======= QR and Barcode scanning using jsQR and QuaggaJS =======




let stream1=false;
let scanning = false;
let detected = false;

async function startScan(id) {
  stream1 = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  const video1 = document.getElementById(`video_${id}`);
  video1.style.display="block"
  video1.srcObject = stream1;
  scanning = true;
  detected = false;

  startBarcodeDetector(id);
  scanQRLoop(id);
}

/* ---------- QR DETECTION (HIGH PRIORITY) ---------- */
function scanQRLoop(id) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const video1 = document.getElementById(`video_${id}`);

  function tick() {
    if (!scanning || detected) return;

    if (video1.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video1.videoWidth;
      canvas.height = video1.videoHeight;
      ctx.drawImage(video1, 0, 0);

      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(img.data, canvas.width, canvas.height);

      if (qr) {
        detected = true;
        handleResult(id, qr.data);
        return;
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* ---------- BARCODE DETECTION ---------- */
function startBarcodeDetector(id) {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector(`#video_${id}`),
      constraints: { facingMode: "environment" }
    },
    decoder: {
      readers: [
        "ean_reader",
        "ean_8_reader",
        "code_128_reader",
        "code_39_reader",
        "upc_reader"
      ]
    }
  }, err => {
    if (!err) Quagga.start();
  });

  Quagga.onDetected(data => {
    if (detected) return;
    detected = true;
    handleResult(id, data.codeResult.code);
  });
}



/* ---------- RESULT ---------- */
function handleResult(id, value) {
  document.getElementById("result").innerText =
    `${id} detected: ${value}`;

  console.log(id, value);

  stopScan(id);
}


function stopScan(id) {
	const video1 = document.getElementById(`video_${id}`);
	
  scanning = false;
  const tracks = video1.srcObject?.getTracks();
  tracks?.forEach(t => t.stop());
  video1.style.display="none"
}





