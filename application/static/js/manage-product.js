var cartTable = $("#cartTable");
$(function () {
    if(localStorage.getItem('login') === null){
        $(".ordersList").hide()
        $(".producersList").hide()
        $(".categoriesList").hide()
        $(".cabinetBtn").hide()
        $(".openCart").hide()
        $(".delete-product").hide()
        $(".edit-product").hide()
        $(".addToCart").hide()
        $(".add-product").hide()
    }
    if(localStorage.getItem('login') !== 'admin'){
        $(".ordersList").hide()
        $(".producersList").hide()
        $(".categoriesList").hide()
        $(".delete-product").hide()
        $(".edit-product").hide()
        $(".add-product").hide()
    }
    if(localStorage.getItem('login') === 'admin'){
        $(".addToCart").hide()
        $(".openCart").hide()
    }

    var data = {
        added_products_id: localStorage.getItem('CartList')
    };
    //JSON data by API call
    $.get(cartItemsUrl, data, function (response) {
        if (response) {
            var totalSum = 0;
            $.each(response, function (index, product) {
                let row = '<tr data-id="' + product.product_id +
                    '" data-name="' + product.prod_name +
                    '" data-price="' + product.price +
                    '" data-qty="' + product.qty + '">' +
                    '" data-total="' + (product.qty * product.price) + '">' +
                    '<td class="data-name">' + product.prod_name + '</td>' +
                    '<td class="data-price">' + product.price + '</td>' +
                    '<td class="data-qty">' + product.qty + '</td>' +
                    '<td class="data-total">' + product.qty * product.price + '</td>';

                $("#cartTable").append(row);
                totalSum += product.qty * product.price;

            });
            $("#totalSum").text(totalSum);
        }
    });
});

var ordersTable = $("#ordersTable");
$(function () {
    //JSON data by API call
    $.get(orderItemsUrl, function (response) {
        if (response) {
            var totalSum = 0;
            $.each(response, function (index, order) {

                let row = '<tr data-id="' + order.order_id +
                    '" data-date="' + order.order_date + '">' +
                    '<td class="data-id">' + order.order_id + '</td>' +
                    '<td class="data-date">' + order.order_date + '</td>' +
                    '<td class="data-user">' + order.customer_id + '</td>' +
                    '<td class="data-link"><span class="btn btn-xs btn-info order-details">Детальніше</span></td>';

                if(order.customer_name === localStorage.getItem('login') || localStorage.getItem('login') === 'admin'){
                    $("#ordersTable").append(row);
                }


            });
        }
    });
});

$(document).on("click", ".order-details", function () {
    var tr = $(this).closest('tr');
    console.log(tr.data('id'));
    window.location.replace(orderUrl+tr.data('id'));
    // var data = {
    //     product_id: tr.data('id')
    // };
    // var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    // if (isDelete) {
    //     callApi("POST", productDeleteApiUrl, data);
    // }
})

// Save Product
$("#saveProduct").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        prod_name: null,
        category_id: null,
        producer_id: null,
        price: null,
        qty: null
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.prod_name = element.value;
                break;
            case 'categories':
                requestPayload.category_id = element.value;
                break;
            case 'producers':
                requestPayload.producer_id = element.value;
                break;
            case 'price':
                requestPayload.price = element.value;
                break;
            case 'qty':
                requestPayload.qty = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", productSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$("#saveCategory").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#categoryForm").serializeArray();
    var requestPayload = {
        category_name: null
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.category_name = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", categorySaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$("#saveProducer").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#producerForm").serializeArray();
    var requestPayload = {
        producer_name: null
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.producer_name = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", producerSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    var data = {
        product_id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", productDeleteApiUrl, data);
    }
})

$(document).on("click", ".delete-category", function () {
    var tr = $(this).closest('tr');
    var data = {
        id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", categoryDeleteApiUrl, data);
    }
})

$(document).on("click", ".delete-producer", function () {
    var tr = $(this).closest('tr');
    var data = {
        id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", producerDeleteApiUrl, data);
    }
})

$(document).on("click", ".add-product", function () {
    $("#prodFormTitle").text('Додати новий продукт');
    $("#saveProduct").show();
    $("#saveEditedProduct").hide();
    $("#prodFormName").val('');
    $("#prodFormCategories").val('');
    $("#prodFormProducers").val('');
    $("#prodFormPrice").val('');
    $("#prodFormQty").val('');
});

$(document).on("click", ".add-category", function () {
    $("#categoryFormTitle").text('Додати нову категорію');
    $("#saveCategory").show();
    $("#saveEditedCategory").hide();
    $("#categoryFormName").val('');
});

$(document).on("click", ".add-producer", function () {
    $("#producerFormTitle").text('Додати нового виробника');
    $("#saveProducer").show();
    $("#saveEditedProducer").hide();
    $("#producerFormName").val('');
});

$(document).on("click", ".edit-product", function () {
    var tr = $(this).closest('tr');
    var product_id = tr.data('id');
    $("#prodFormTitle").text('Редагувати продукт');
    $("#saveProduct").hide();
    $("#saveEditedProduct").show();

    $.get(getProductUrl + product_id, function (response) {
        if (response) {
            $("#prodFormId").val(response.product_id);
            $("#prodFormName").val(response.prod_name);
            $("#prodFormCategories").val(response.category_id);
            $("#prodFormProducers").val(response.producer_id);
            $("#prodFormPrice").val(response.price);
            $("#prodFormQty").val(response.qty);
        }
    });
});

$(document).on("click", ".edit-category", function () {
    var tr = $(this).closest('tr');
    var category_id = tr.data('id');
    $("#categoryFormTitle").text('Редагувати категорію');
    $("#saveCategory").hide();
    $("#saveEditedCategory").show();

    $.get(getCategoryUrl + category_id, function (response) {
        if (response) {
            $("#categoryFormId").val(response.category_id);
            $("#categoryFormName").val(response.category_name);
        }
    });
});

$(document).on("click", ".edit-producer", function () {
    var tr = $(this).closest('tr');
    var producer_id = tr.data('id');
    $("#producerFormTitle").text('Редагувати виробника');
    $("#saveProducer").hide();
    $("#saveEditedProducer").show();

    $.get(getProducerUrl + producer_id, function (response) {
        if (response) {
            $("#producerFormId").val(response.producer_id);
            $("#producerFormName").val(response.producer_name);
        }
    });
});

$("#saveEditedProduct").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_id: null,
        prod_name: null,
        category_id: null,
        producer_id: null,
        price: null,
        qty: null
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'id':
                requestPayload.product_id = element.value;
                break;
            case 'name':
                requestPayload.prod_name = element.value;
                break;
            case 'categories':
                requestPayload.category_id = element.value;
                break;
            case 'producers':
                requestPayload.producer_id = element.value;
                break;
            case 'price':
                requestPayload.price = element.value;
                break;
            case 'qty':
                requestPayload.qty = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", productEditApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$("#saveEditedCategory").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#categoryForm").serializeArray();
    var requestPayload = {
        category_id: null,
        category_name: null,
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'id':
                requestPayload.category_id = element.value;
                break;
            case 'name':
                requestPayload.category_name = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", categoryEditApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$("#saveEditedProducer").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#producerForm").serializeArray();
    var requestPayload = {
        producer_id: null,
        producer_name: null,
    };
    console.log(requestPayload);
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'id':
                requestPayload.producer_id = element.value;
                break;
            case 'name':
                requestPayload.producer_name = element.value;
                break;
        }
    }
    console.log(requestPayload);
    callApi("POST", producerEditApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$(".login-btn").on("click", function () {
    var data = $("#loginForm").serializeArray();
    var requestPayload = {
        login: null,
        password: null,
    };
    console.log(requestPayload);
    var login = '';
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'login':
                requestPayload.login = element.value;
                login = element.value;
                break;
            case 'password':
                requestPayload.password = element.value;
                break;
        }
    }
    $.ajax({
        method: "POST",
        url: loginFormUrl,
        data: {'data': JSON.stringify(requestPayload)}
    }).done(function( msg ) {
        if(msg === 'OK'){
            localStorage.setItem('login', login)
            alert('Ви увійшли в систему як '+login)
        }else{
            alert('Невірно введений логін чи пароль')
        }
        window.location.reload();
    });
});

$(document).ready(function () {
    $("#prodSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#prodTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#cartSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#cartTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).on("click", ".addToCart", function () {
    var prod_id = $(this).closest('tr').data('id');
    let cartList = JSON.parse(localStorage.getItem('CartList'))
    if (!cartList)
        cartList = []
    cartList.push(prod_id)
    localStorage.setItem('CartList', JSON.stringify(cartList))
    alert('Товар додано у корзину')
})

$(document).on("click", ".openCart", function () {
    window.location.replace(cartUrl);
})

$(document).on("click", ".prodList", function () {
    window.location.replace(prodListUrl);
})

$(document).on("click", ".ordersList", function () {
    window.location.replace(ordersUrl);
})

$(document).on("click", ".producersList", function () {
    window.location.replace(producersListUrl);
})

$(document).on("click", ".categoriesList", function () {
    window.location.replace(categoriesListUrl);
})

$(document).on("click", ".loginBtn", function () {
    window.location.replace(loginUrl);
})

$(document).on("click", ".cabinetBtn", function () {
    window.location.replace(cabinetUrl+localStorage.getItem('login'));
})

$("#placeOrder").on("click", function () {
    var ary = [];
        $(function () {
            $('#cartTable tr').each(function (index, el) {

                ary.push(Object.assign({}, el.dataset) );
            });
            console.log(ary);
        });
    // console.log(requestPayload);
    localStorage.removeItem('CartList');
    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(ary),
        'login': JSON.stringify(localStorage.getItem('login'))
    });

});

$("#deleteOrder").on("click", function () {
    localStorage.clear();
    window.location.reload();
});
