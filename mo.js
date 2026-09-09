let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let totalValue = document.getElementById('total-value');

let mood = 'create';
let tmp;

// حساب الإجمالي وتحديث شاشة البورصة
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        totalValue.innerHTML = `Total Value = $${result.toLocaleString()}`; // اضافة الفواصل للأرقام الكبيرة
        totalValue.style.color = '#10b981'; // أخضر
    } else {
        totalValue.innerHTML = `Total Value = $0.00`;
        totalValue.style.color = '#ef4444'; // أحمر في حال الفراغ
    }
}

// إنشاء مصفوفة لحفظ البيانات
let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}

// إنشاء منتج جديد
function createData() {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: (+price.value + +taxes.value + +ads.value) - +discount.value,
        count: count.value,
        category: category.value.toLowerCase(),
    }

    // ========== تعديلات الـ Clean Data ==========
    // التأكد من أن الحقول المهمة غير فارغة وأن العدد أقل من أو يساوي 100
    if (title.value != '' && price.value != '' && category.value != '' && newPro.count <= 100) {
        if (mood === 'create') {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = '<i class="fa-solid fa-plus"></i> CREATE';
            count.style.display = 'block';
        }
        // مسح البيانات فقط إذا تمت عملية الإضافة أو التعديل بنجاح
        clearData(); 
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// تفريغ الحقول
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    count.value = '';
    category.value = '';
    totalValue.innerHTML = 'Total Value = $0.00';
    totalValue.style.color = '#ef4444';
}

// عرض البيانات في الجدول
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += buildRow(i);
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAllBlock');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()" id="deleteAllBtn"><i class="fa-solid fa-trash-can"></i> DELETE ALL (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}
showData();

// حذف منتج واحد
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData();
}

// حذف الكل
function deleteAll() {
    localStorage.clear();
    dataPro.splice(0);
    showData();
}

// تحديث منتج
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> UPDATE';
    mood = 'update';
    tmp = i;
    scroll({ top: 0, behavior: 'smooth' });
}

// البحث
let searchMood = 'title';
function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
        search.placeholder = 'Search By Item...';
    } else {
        searchMood = 'category';
        search.placeholder = 'Search By Category...';
    }
    search.focus();
    search.value = '';
    showData();
}

function searchData(value) {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood == 'title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table += buildRow(i);
            }
        } else {
            if (dataPro[i].category.includes(value.toLowerCase())) {
                table += buildRow(i);
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// بناء الصفوف لتجنب تكرار الكود
function buildRow(i) {
    return `
    <tr>
        <td>${i+1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})" id="update"><i class="fa-solid fa-pen"></i> UPDATE</button></td>
        <td><button onclick="deleteData(${i})" id="delete"><i class="fa-solid fa-trash"></i> DELETE</button></td>
    </tr>`;
}