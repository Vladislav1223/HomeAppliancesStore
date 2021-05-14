from application import db

from flask_sqlalchemy import SQLAlchemy


class Category(db.Model):
    __tablename__ = 'categories'
    __table_args__ = {'schema': 'appliancesstore'}

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(20), nullable=False)

    def to_json(self):
        return {
            'category_id': self.category_id,
            'category_name': self.category_name,
        }


class Producer(db.Model):
    __tablename__ = 'producers'
    __table_args__ = {'schema': 'appliancesstore'}

    producer_id = db.Column(db.Integer, primary_key=True)
    producer_name = db.Column(db.String(45), nullable=False)

    def to_json(self):
        return {
            'producer_id': self.producer_id,
            'producer_name': self.producer_name,
        }


class Product(db.Model):
    __tablename__ = 'products'
    __table_args__ = {'schema': 'appliancesstore'}

    product_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.ForeignKey('appliancesstore.categories.category_id'), index=True)
    producer_id = db.Column(db.ForeignKey('appliancesstore.producers.producer_id'), index=True)
    prod_name = db.Column(db.String(45), nullable=False)
    price = db.Column(db.Float, nullable=False)
    qty = db.Column(db.Integer, nullable=False)

    category = db.relationship('Category', primaryjoin='Product.category_id == Category.category_id', backref='products')
    producer = db.relationship('Producer', primaryjoin='Product.producer_id == Producer.producer_id', backref='products')

    def to_json(self):
        return {
            'product_id': self.product_id,
            'category_id': self.category_id,
            'producer_id': self.producer_id,
            'prod_name': self.prod_name,
            'price': self.price,
            'qty': self.qty
        }


class Customer(db.Model):
    __tablename__ = 'customers'
    __table_args__ = {'schema': 'appliancesstore'}

    customer_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(20), nullable=False)
    lname = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20))
    user_id = db.Column(db.ForeignKey('appliancesstore.users.user_id'), nullable=False, index=True)

    user = db.relationship('User', primaryjoin='Customer.user_id == User.user_id', backref='customers')


class Discount(db.Model):
    __tablename__ = 'discounts'
    __table_args__ = {'schema': 'appliancesstore'}

    discount_id = db.Column(db.Integer, primary_key=True)
    discount_name = db.Column(db.String(45), nullable=False)
    discount_volume = db.Column(db.Float, nullable=False)


class Orderitem(db.Model):
    __tablename__ = 'orderitems'
    __table_args__ = {'schema': 'appliancesstore'}

    orderitems_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.ForeignKey('appliancesstore.orders.order_id'), nullable=False, index=True)
    prod_id = db.Column(db.ForeignKey('appliancesstore.products.product_id'), nullable=False, index=True)
    discount_id = db.Column(db.ForeignKey('appliancesstore.discounts.discount_id'), index=True)
    qty = db.Column(db.Integer, nullable=False)

    discount = db.relationship('Discount', primaryjoin='Orderitem.discount_id == Discount.discount_id', backref='orderitems')
    order = db.relationship('Order', primaryjoin='Orderitem.order_id == Order.order_id', backref='orderitems')
    prod = db.relationship('Product', primaryjoin='Orderitem.prod_id == Product.product_id', backref='orderitems')


class Order(db.Model):
    __tablename__ = 'orders'
    __table_args__ = {'schema': 'appliancesstore'}

    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.ForeignKey('appliancesstore.users.user_id'), index=True)
    order_date = db.Column(db.Date, nullable=False)

    customer = db.relationship('User', primaryjoin='Order.customer_id == User.user_id', backref='orders')

    def to_json(self):
        customer_name = self.customer.login if self.customer_id else ''
        return {
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'customer_name': customer_name,
            'order_date': self.order_date,
        }


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'appliancesstore'}

    user_id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    usertype_id = db.Column(db.ForeignKey('appliancesstore.usertype.usertype_id'), nullable=False, index=True)

    usertype = db.relationship('Usertype', primaryjoin='User.usertype_id == Usertype.usertype_id', backref='users')


class Usertype(db.Model):
    __tablename__ = 'usertype'
    __table_args__ = {'schema': 'appliancesstore'}

    usertype_id = db.Column(db.Integer, primary_key=True)
    usertype = db.Column(db.String(20), nullable=False)
