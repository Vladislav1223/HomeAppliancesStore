// Define your api here
var productListApiUrl = 'http://127.0.0.1:5000/getProducts';
var getProductUrl = 'http://127.0.0.1:5000/getProduct/';
var getCategoryUrl = 'http://127.0.0.1:5000/getCategory/';
var getProducerUrl = 'http://127.0.0.1:5000/getProducer/';
var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var categorySaveApiUrl = 'http://127.0.0.1:5000/insertCategory';
var producerSaveApiUrl = 'http://127.0.0.1:5000/insertProducer';
var productEditApiUrl = 'http://127.0.0.1:5000/editProduct';
var categoryEditApiUrl = 'http://127.0.0.1:5000/editCategory';
var producerEditApiUrl = 'http://127.0.0.1:5000/editProducer';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';
var producerDeleteApiUrl = 'http://127.0.0.1:5000/deleteProducer';
var categoryDeleteApiUrl = 'http://127.0.0.1:5000/deleteCategory';
var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:5000/insertOrder';
var cartUrl = 'http://127.0.0.1:5000/cart';
var prodListUrl = 'http://127.0.0.1:5000/prodList';
var producersListUrl = 'http://127.0.0.1:5000/producersList';
var categoriesListUrl = 'http://127.0.0.1:5000/categoriesList';
var cartItemsUrl = 'http://127.0.0.1:5000/cartItems';
var ordersUrl = 'http://127.0.0.1:5000/orders';
var orderUrl = 'http://127.0.0.1:5000/order/';
var orderItemsUrl = 'http://127.0.0.1:5000/orderItems';
var loginUrl = 'http://127.0.0.1:5000/login';
var cabinetUrl = 'http://127.0.0.1:5000/cabinet/';
var loginFormUrl = 'http://127.0.0.1:5000/loginForm';

// For product drop in order
var productsApiUrl = 'https://fakestoreapi.com/products';

function callApi(method, url, data) {
    $.ajax({
        method: method,
        url: url,
        data: data
    }).done(function( msg ) {
        window.location.reload();
    });
}

function calculateValue() {
    var total = 0;
    $(".product-item").each(function( index ) {
        var qty = parseFloat($(this).find('.product-qty').val());
        var price = parseFloat($(this).find('#product_price').val());
        price = price*qty;
        $(this).find('#item_total').val(price.toFixed(2));
        total += price;
    });
    $("#product_grand_total").val(total.toFixed(2));
}

function orderParser(order) {
    return {
        id : order.id,
        date : order.employee_name,
        orderNo : order.employee_name,
        customerName : order.employee_name,
        cost : parseInt(order.employee_salary)
    }
}

function productParser(product) {
    return {
        id : product.id,
        name : product.employee_name,
        unit : product.employee_name,
        price : product.employee_name
    }
}

function productDropParser(product) {
    return {
        id : product.id,
        name : product.title
    }
}

//To enable bootstrap tooltip globally
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip()
// });