import datetime
import random

from flask import jsonify, render_template, request

from application import app, db
from application.models import Product, Category, Producer, Order, Orderitem, User

import json


@app.route('/')
@app.route('/prodList')
def all_prod_list():
    products = Product.query.all()
    categories = Category.query.all()
    producers = Producer.query.all()
    for product in products:
        print(product.prod_name)
    return render_template('products_list.html', products=products, categories=categories, producers=producers)


@app.route('/producersList')
def all_producers_list():
    producers = Producer.query.all()
    return render_template('producers_list.html', producers=producers)


@app.route('/categoriesList')
def all_categories_list():
    categories = Category.query.all()
    return render_template('categories_list.html', categories=categories)


@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = json.loads(request.form['data'])
    product = Product(
        category_id=request_payload['category_id'],
        producer_id=request_payload['producer_id'],
        prod_name=request_payload['prod_name'],
        price=request_payload['price'],
        qty=request_payload['qty']
    )
    db.session.add(product)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertCategory', methods=['POST'])
def insert_category():
    request_payload = json.loads(request.form['data'])
    category = Category(
        category_name=request_payload['category_name'])
    db.session.add(category)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertProducer', methods=['POST'])
def insert_producer():
    request_payload = json.loads(request.form['data'])
    producer = Producer(
        producer_name=request_payload['producer_name'])
    db.session.add(producer)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/editProduct', methods=['POST'])
def edit_product():
    request_payload = json.loads(request.form['data'])
    product = Product.query.get(request_payload['product_id'])

    product.category_id = request_payload['category_id'],
    product.producer_id = request_payload['producer_id'],
    product.prod_name = request_payload['prod_name'],
    product.price = request_payload['price'],
    product.qty = request_payload['qty']

    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/editProducer', methods=['POST'])
def edit_producer():
    request_payload = json.loads(request.form['data'])
    producer = Producer.query.get(request_payload['producer_id'])

    producer.producer_name = request_payload['producer_name'],

    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/editCategory', methods=['POST'])
def edit_category():
    request_payload = json.loads(request.form['data'])
    category = Category.query.get(request_payload['category_id'])

    category.category_id = request_payload['category_id'],
    category.category_name = request_payload['category_name'],

    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    prod_id = json.loads(request.form['product_id'])
    product = Product.query.get(prod_id)
    db.session.delete(product)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteProducer', methods=['POST'])
def delete_producer():
    producer_id = json.loads(request.form['id'])
    producer = Producer.query.get(producer_id)
    db.session.delete(producer)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteCategory', methods=['POST'])
def delete_category():
    category_id = json.loads(request.form['id'])
    category = Category.query.get(category_id)
    db.session.delete(category)
    db.session.commit()
    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getProduct/<product_id>')
def get_product(product_id):
    product = Product.query.get(product_id)
    response = jsonify(product.to_json())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getCategory/<category_id>')
def get_category(category_id):
    category = Category.query.get(category_id)
    response = jsonify(category.to_json())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getProducer/<producer_id>')
def get_producer(producer_id):
    producer = Producer.query.get(producer_id)
    response = jsonify(producer.to_json())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/cart', methods=['GET', 'POST'])
def cart():
    return render_template('product_cart.html')


@app.route('/cartItems', methods=['GET', 'POST'])
def cart_items():
    products_id = json.loads(request.args['added_products_id'])
    products_count = {x: products_id.count(x) for x in products_id}
    products = Product.query.all()
    cart_list = []
    for product in products:
        if product.product_id in products_count.keys():
            product.qty = products_count[product.product_id]
            cart_list.append(product.to_json())
    response = jsonify(cart_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/order/<order_id>', methods=['GET', 'POST'])
def some_order(order_id):
    orderitems = Orderitem.query.filter_by(order_id=order_id).all()
    total_sum = 0
    for item in orderitems:
        total_sum += item.prod.price * item.prod.qty
    return render_template('order.html', orderitems=orderitems, total_sum=total_sum)
    # return order_id


@app.route('/orders', methods=['GET', 'POST'])
def order_page():
    return render_template('orders_list.html')


@app.route('/orderItems', methods=['GET', 'POST'])
def all_orders():
    orders = Order.query.all()
    orders_list = []
    for order in orders:
        orders_list.append(order.to_json())
    response = jsonify(orders_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertOrder', methods=['GET', 'POST'])
def place_order():
    products_info = json.loads(request.form['data'])
    user = User.query.filter_by(login=json.loads(request.form['login'])).first()
    order = Order(
        order_date=datetime.date.today(),
        order_id=random.randrange(10000, 99999),
        customer_id=user.user_id
    )
    db.session.add(order)
    print(f'new order_id: {order.order_id}')

    for product in products_info:
        order_item = Orderitem(
            order_id=order.order_id,
            prod_id=product['id'],
            qty=product['qty'],
            orderitems_id=random.randrange(100000, 999999)
        )
        db.session.add(order_item)
    db.session.commit()

    response = jsonify('OK')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response




@app.route('/login', methods=['GET', 'POST'])
def login_page():
    return render_template('login.html')


@app.route('/loginForm', methods=['GET', 'POST'])
def login_form():
    login_info = json.loads(request.form['data'])
    user = User.query.filter_by(login=login_info['login']).first()
    if user and user.password == login_info['password']:
        response = jsonify('OK')
    else:
        response = jsonify('FAIL')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/cabinet/<login>', methods=['GET', 'POST'])
def cabinet_page(login):
    return render_template('cabinet.html', login=login)