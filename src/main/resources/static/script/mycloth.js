




// ======= Basic app state using localStorage =======
const STORAGE_KEY = 'clothstore-data-v1'
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
       } else {
        
           s.style.display = 'none'
       }
       
         })
    const id = 'view-' + view
    const el = document.getElementById(id)
    if (el) el.style.display = 'block'
    // update stats
    document.getElementById('stat-count').textContent = state.products.length
    renderInventory()
    renderCustomers()
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


// ======= Customers =======
function renderCustomers() {
    const tbl = document.getElementById('cust-table')
    tbl.innerHTML = state.customers.map((c, idx) =>
        `<tr>
                    <td>${escapeHtml(c.name)}</td>
                    <td>${escapeHtml(c.phone)}</td>
                    <td>
                       <button class="ghost" data-idx="${idx}">Delete</button>
                    </td>
                </tr>`).join('')

    tbl.querySelectorAll('button').forEach(b =>
        b.addEventListener('click', e => {
            const idx = +e.currentTarget.dataset.idx;
            state.customers.splice(idx, 1);
            writeState(state);
            renderCustomers()
        }))

    document.getElementById('stat-count').textContent = state.products.length
}

// ======= Add Customer =======
document.getElementById('add-customer').addEventListener('click', () => {
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    if (!name) {
        alert('Name required');
        return
    }
    state.customers.push({ name, phone });
    writeState(state);
    document.getElementById('c-name').value = '';
    document.getElementById('c-phone').value = '';
    renderCustomers();
})


// ======= Export / Import / Clear =======
document.getElementById('export-inventory').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'clothstore-inventory.json';
    a.click(); URL.revokeObjectURL(url);
})
document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const txt = await file.text();
        const imported = JSON.parse(txt);
        if (imported.products && Array.isArray(imported.products)) {
            state = imported; writeState(state);
            renderInventory(); renderCustomers();
            alert('Imported')
        }
        else alert('Invalid file')
    }
    catch (err) {
        alert('Failed to import')
    }
})
document.getElementById('clear-storage').addEventListener('click', () => {
    if (confirm('Clear ALL data?')) {
        state = structuredClone(defaultState);
        writeState(state); renderInventory();
        renderCustomers(); alert('Cleared')
    }
})



function genBill(){
}



// ======= Billing cart logic =======
let cart = []
function renderCart() {
    console.log('renderCart called')
    const now = new Date();  // Get current date and time
     const formattedDateTime = now.toLocaleString('en-IN');
      // Show in HTML
      document.getElementById('date').innerHTML = formattedDateTime;

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


document.getElementById('discount').addEventListener('input', renderCart)
document.getElementById('advPay').addEventListener('input', renderCart)
document.getElementById('clear-cart').addEventListener('click', () => { cart = []; renderCart() })



// add product to cart by search
document.getElementById('add-by-sku').addEventListener('click', () => {
    const q = document.getElementById('search-product').value.trim().toLowerCase()
    if (!q) return alert('Enter product name or SKU')
    const found = state.products.find(p => p.sku.toLowerCase() === q || p.name.toLowerCase().includes(q))
    if (!found) return alert('Product not found')
    const item = { sku: found.sku, name: found.name, price: found.price, qty: 1 }
    cart.push(item)
    renderCart()
    
})

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


// print invoice (simple)
document.getElementById('print-invoice').addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart empty')
    const doc = generateInvoiceHTML()
    const w = window.open('', '_blank')
    w.document.write(doc)
    w.document.close()
    w.print()
})



function generateInvoiceHTML() {
    console.log('generateInvoiceHTML called')
        console.log('cart is : called : ', cart)
   let mobile= document.getElementById('cust-phone').value;
   let cName= document.getElementById('cust-name').value;
   let date= document.getElementById('date').value || new Date().toLocaleString('en-IN');

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const disc = parseFloat(document.getElementById('discount').value) || 0
    const total = Math.max(0, subtotal - disc)

     const advPay = parseFloat(document.getElementById('advPay').value) || 0
    const remaingTotal = Math.max(0, total - advPay)


  let saveBillsToBack=`http://localhost:8080/app/v1/savebill`;

        const responce= new Request(saveBillsToBack,{
            method:"Post",
            headers:{
                'Accept' : 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
                // 'Access-Control-Allow-Origin':"http://127.0.0.1:5500",
                // Authorization : `Bearer ${token}`,
                // "alg": "HS256",
                // "typ": "JWT"
            },
            body:JSON.stringify({
                "costomerName":cName,
                "mobileNo":mobile,
                "date":date,
                "itomes":cart,
                "subTotal":subtotal,
                "discount":disc,
                "totalPayAmt":total,
                "advAmt":advPay,
                "remainingAmt":remaingTotal
        })

    });
            fetch(responce) 
                            .then((responce)=>{
                               let  j= responce.json();
                                j.then((data)=>{
                                   alert("Bills Saved Successfully");
                                    console.log("Response : "+ data);
                                   

                           document.getElementById("bill_NO").innerHTML = "Bill No : "+ data;         
                    })
                            })
                            .catch((err)=>{
                                console.log("Error"+ err);
                            });



    const lines = cart.map(i =>
        `<tr>
                <td>${escapeHtml(i.name)}</td>
                <td>${(i.sku)}-${(i.colour)}</td>
                <td>${i.qty}</td>
                 <td>${i.price}</td>
                <td>₹${(i.price * i.qty).toFixed(2)}</td>
            </tr>`).join('')
   


    return `<!doctype html><html><head><meta charset="utf-8">
        <title>Invoice</title>
        <style>
        body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}td,th{padding:6px;border-bottom:1px solid #ddd}</style>
        </head>
        <body>
                <h2>Invoice </h2>
                <a id="bill_NO">bill No: 301</a> 
                <a id="date_NO">Date: ${(date)} </a> 
                <h1>Mauli Dresses itoli</h1>
                 <div class="preview">
                    <canvas id="qrcanvas"></canvas>
                    <div class="meta">
                            Right-click the image to save, or use the download button.
                    </div>
                </div>

                <p>Customer: ${escapeHtml(cName)||'N/A'} ${mobile?('('+escapeHtml(mobile)+')'):''} </p>
                <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>HsnNo</th>
                                <th>Qty</th>
                                 <th>price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>${lines}</tbody>
                    </table>
                    <hr><p>Subtotal: ₹${subtotal.toFixed(2)}</p>
                        <p>Discount: ₹${disc.toFixed(2)}</p>
                        <p><strong>Total Pay: ₹${total.toFixed(2)}</strong></p>
                       <hr>
                        <p> Advance: ₹${advPay.toFixed(2)}</p>
                        <p><strong> Remaing Total Pay: ₹${remaingTotal.toFixed(2)}</strong></p>
                          <p>Thank you for shopping with us!</p>


        </body>
        </html>`
}

// ======= Barcode / QR scanning (Browser API with fallback) =======
let stream = null, videoTrack = null
const video = document.getElementById('video')
async function startCamera() {
    if (!('mediaDevices' in navigator)) { alert('Camera not supported'); return }
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    video.srcObject = stream
    video.play()
    const tracks = stream.getVideoTracks()
    videoTrack = tracks[0]

        let scanQRApi=`http://localhost:8080/app/v1/scanQrCode`;

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
                                    
                                    scanProductFuntion(data);
                                     
                                     
                                }
                            )
                            })
                            .catch((err)=>{
                                console.log("Error"+ err);
                            });


    // try BarcodeDetector
    // if ('BarcodeDetector' in window) {
    //     const formats = BarcodeDetector.getSupportedFormats ? await BarcodeDetector.getSupportedFormats() : ['qr_code', 'ean_13', 'code_128']
    //     const detector = new BarcodeDetector({ formats })
    //     const loop = async () => {
    //         try {
    //             const barcodes = await detector.detect(video)
    //             if (barcodes && barcodes.length) {
    //                 document.getElementById('detected').textContent = barcodes.map(b => b.rawValue).join('\n')
    //                 // when found, optionally add to cart if sku matches
    //                 const raw = barcodes[0].rawValue
    //                 const found = state.products.find(p => p.sku === raw || p.sku.toLowerCase() === raw.toLowerCase())
    //                 if (found) { cart.push({ sku: found.sku, name: found.name, price: found.price, qty: 1 }); renderCart() }
    //             }
    //         } catch (e) {/* ignore */ }
    //         if (stream) requestAnimationFrame(loop)
    //     }
    //     loop()
    // } else {
    //     // fallback: simple canvas decoding not implemented (would need external lib). We'll just show video.
    // }


}


  function scanProductFuntion(d){
        let scanQRApi=`http://localhost:8080/app/v1/product/rcode/`+d;

        const responce= new Request(scanQRApi,{
            method:"get",
        });
            fetch(responce) 
                            .then((responce)=>{
                               let  j= responce.json();
                                j.then((data)=>{
                                   alert("Bill Genrate ok Csanned Successfully 1");
                                   console.log("name : "+ data.name);
                                     console.log("hsn : "+ data.hsnNo);
                                      console.log("price : "+ data.price);
                                     console.log("colour : "+ data.colour);
                                     addproductFuntion(data);;
                                     
                                }
                            )
                            })
                            .catch((err)=>{
                                console.log("Error"+ err);
                            });
      
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
renderInventory(); renderCustomers(); renderCart()



// ======= Utility =======
function escapeHtml(s) {
     return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') 
    }



// quick hook: when user switches views, repaint
window.addEventListener('focus', () => { 
            renderInventory(); 
            renderCustomers(); 
            renderCart() 
        })



   // make QR code for new product     
        document.getElementById('makeQr').addEventListener('click', ()=>{
            window.location.href = 'http://localhost:8080/product';

        })

        



//    ---------------- Orders ................ ------------------------  

const ordersKey = 'orders-demo-v1';
    function iso(d){return new Date(d).toISOString()}
    const now = new Date();
    const sample = [
      {id:'ORD-1001',customer:'Rahul Sharma',date:iso(new Date(now.getFullYear(), now.getMonth(), now.getDate())),items:3,amount:1299.00,status:'Paid'},
      {id:'ORD-1002',customer:'Sneha Patel',date:iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-1)),items:2,amount:899.00,status:'Paid'},
      {id:'ORD-1003',customer:'Amit Kumar',date:iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-3)),items:1,amount:499.00,status:'Pending'},
      {id:'ORD-1004',customer:'Neha Singh',date:iso(new Date(now.getFullYear(), now.getMonth()-1, 15)),items:4,amount:2799.50,status:'Paid'},
      {id:'ORD-1005',customer:'Vikram Joshi',date:iso(new Date(now.getFullYear()-1, 5, 10)),items:2,amount:1199.99,status:'Refunded'},
      {id:'ORD-1006',customer:'Rita Desai',date:iso(new Date(now.getFullYear(), now.getMonth(), now.getDate())),items:1,amount:399.00,status:'Paid'},
      {id:'ORD-1007',customer:'Karan Verma',date:iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-7)),items:5,amount:4999.00,status:'Paid'}
    ];
    if(!localStorage.getItem(ordersKey)) localStorage.setItem(ordersKey, JSON.stringify(sample));
    let orders = JSON.parse(localStorage.getItem(ordersKey));

    function startOfWeek(d){ const dt=new Date(d); const day=dt.getDay(); const diff=dt.getDate()-day+(day===0?-6:1); return new Date(dt.setDate(diff)); }
    function endOfWeek(d){ const s=startOfWeek(d); return new Date(s.getFullYear(), s.getMonth(), s.getDate()+6,23,59,59,999); }
    function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
    function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0,23,59,59,999); }
    function startOfYear(d){ return new Date(d.getFullYear(),0,1); }
    function endOfYear(d){ return new Date(d.getFullYear(),11,31,23,59,59,999); }

    function filterByRange(range){ const today=new Date(); let from=null,to=null; switch(range){
      case 'today': from=new Date(today.getFullYear(),today.getMonth(),today.getDate()); to=new Date(from.getFullYear(),from.getMonth(),from.getDate(),23,59,59,999); break;
      case 'yesterday': const y=new Date(today); y.setDate(y.getDate()-1); from=new Date(y.getFullYear(),y.getMonth(),y.getDate()); to=new Date(from.getFullYear(),from.getMonth(),from.getDate(),23,59,59,999); break;
      case 'this_week': from=startOfWeek(today); to=endOfWeek(today); break;
      case 'last_week': const lw=new Date(today); lw.setDate(lw.getDate()-7); from=startOfWeek(lw); to=endOfWeek(lw); break;
      case 'this_month': from=startOfMonth(today); to=endOfMonth(today); break;
      case 'last_month': const lm=new Date(today.getFullYear(),today.getMonth()-1,1); from=startOfMonth(lm); to=endOfMonth(lm); break;
      case 'this_year': from=startOfYear(today); to=endOfYear(today); break;
      case 'all': from=new Date(0); to=new Date(8640000000000000); break;
      default: from=null; to=null; }
      return orders.filter(o=>{ const od=new Date(o.date); if(from && to) return od>=from && od<=to; return true; }); }

    function renderTable(list){ 
              const tbody=document.getElementById('ordersTable'); 
              if(list.length===0){ 
                 tbody.innerHTML='<tr><td colspan="6">No orders found</td></tr>'; 
                 return 
                } 
            tbody.innerHTML=list.map(o=>`<tr><td>${o.id}</td><td>${new Date(o.date).toLocaleString()}</td><td>${o.customer}</td><td>${o.items}</td><td>₹${Number(o.amount).toFixed(2)}</td><td>${o.status}</td></tr>`).join(''); }

    function renderStats(list){ 
                    const count=list.length; 
                    const sales=list.reduce((s,i)=>s+Number(i.amount||0),0); 
                    const avg = count? sales/count:0; 
                     document.getElementById('stat-count1').textContent = count; 
                     document.getElementById('stat-sales').textContent = '₹'+sales.toFixed(2); 
                     document.getElementById('stat-avg').textContent = '₹'+avg.toFixed(2); 
                    }

    function applyQuick(range){
         const filtered=filterByRange(range); 
         renderTable(filtered); renderStats(filtered); }

    document.getElementById('quickRange').addEventListener('change', e=>applyQuick(e.target.value));
    document.getElementById('applyRange').addEventListener('click', ()=>{
        console.log('Apply Range clicked');
      const f=document.getElementById('fromDate').value; 
      const t=document.getElementById('toDate').value; 
            if(!f && !t){ 
                    applyQuick(document.getElementById('quickRange').value);
                     return 
                    }
      const from = f? new Date(f+'T00:00:00') : new Date(0);
      const to = t? new Date(t+'T23:59:59.999') : new Date(8640000000000000);
      const filtered = orders.filter(o=>{ 
                        const od=new Date(o.date); 
                        return od>=from && od<=to; 
                    }); 
            renderTable(filtered); 
            renderStats(filtered);
    });

    document.getElementById('searchBtn').addEventListener('click', ()=>{
      const q=document.getElementById('searchInput').value.trim().toLowerCase(); const sd=document.getElementById('searchDate').value; let list = orders.slice(); if(q){ list = list.filter(o=> o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)); }
      if(sd){ const dateFrom=new Date(sd+'T00:00:00'); const dateTo=new Date(sd+'T23:59:59.999'); list = list.filter(o=>{ const od=new Date(o.date); return od>=dateFrom && od<=dateTo; }); }
      renderTable(list); renderStats(list);
    });

    document.getElementById('resetBtn').addEventListener('click', ()=>{ document.getElementById('fromDate').value=''; document.getElementById('toDate').value=''; document.getElementById('searchInput').value=''; document.getElementById('searchDate').value=''; document.getElementById('quickRange').value='today'; applyQuick('today'); });   document.getElementById('exportCsv').addEventListener('click', ()=>{
      const rows = document.querySelectorAll('#ordersTable tr'); if(rows.length===0) return; const csv=[['Order ID','Date','Customer','Items','Amount','Status']]; rows.forEach(r=>{ const cols = Array.from(r.querySelectorAll('td')).map(c=>c.textContent.trim()); if(cols.length) csv.push(cols); }); const csvText = csv.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n'); const blob=new Blob([csvText],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`orders-${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    applyQuick('today');


// _----------------------Supplier_Purchase_Manager ------------------------------

document.getElementById('Supplier_Purchase_Manager').addEventListener('click', ()=>{
    window.location.href = 'Supplier_Purchase_Manager.html';
});

// -----------------------Supplier_Purchase_Manager-------------------------------------------------

// End of mycloth.js