"""
Schema Design Practice — Interview Style
==========================================

INTERVIEWER PROMPT:

    "We're building a food delivery app.

    People can browse restaurants, look at their menus,
    and place orders for delivery.

    Design the database schema for this system."


That's it. That's all you get.

In a real interview, the interviewer expects YOU to ask clarifying questions,
identify entities, figure out relationships, and propose a schema.

Work through the steps below.


CLARIFIED REQUIREMENTS (after asking the interviewer):
=======================================================
TODO(human): Summarize the clarified requirements here.

Use these categories to organize your summary:

    Users & Roles:
        - Who uses this system? What types of users exist?
        Answer (wiganz): Customer, Restaurant Owner

    Core Actions:
        - What can each user type DO in the system?
        Answer (wiganz): 
            - Customer can browse many restaurants, view their menu
            - Customer can place orders directly
            - Restaurant owner can change their menu (add, update, remove)

    Constraints:
        - What are the rules/limits? (e.g., how many X per Y?)
        - One Order is from One Restaurant only
        - A customer can place unlimited order overtime 
        - Order status is simple filed: PENDING, READY, DELIVERING, DELIVERED, CANCLED
        - Around 50 menu items per restaurant

    Critical Business Rules:
        - What must NEVER break? (e.g., data that must be preserved)
        - If restaurant change their price the old order must still be the old price

    Edge Cases:
        - What happens when things change or go wrong?
        - Order can be cancled
        - If restaunrant delete their menu item the old order must still be the old menu item

    Scale:
        - How many users? How much data? What DB technology?
        - 10,000 user, 500 restaurant
        - No need sharding or No SQL

Fill in each section with bullets based on our conversation above.
"""

from django.db import models


# ============================================================
# STEP 0 — Clarify Requirements
# ============================================================
# What questions would you ask the interviewer?
# Think about: users, actions, constraints, edge cases, scale.
#
# Write your clarifying questions here:
#
# Q1:
# Q2:
# Q3:
# Q4:
# Q5:
#


# ============================================================
# STEP 1 — Identify Access Patterns
# ============================================================
AP1: Customer open the app => Get all the restaunrants
AP2: Customer tap on a restaurant => Get restaunrant's menu
AP3: Customer tap on a menu item => Get menu item's detail
AP4: Restuant owner tap on a menu item => Update menu item
AP5: Customer places an order => Create an order linked to customer + restaurnt + multiple menu items with quantity, each item with quantity and price snapshot 
AP6: Customer tap on an order => Get order's detail
Ap7: Restaunrant owner 'incoming orders' screen => Get all orders for this restaurants filtered by status


# ============================================================
# STEP 2 — Identify Entities
# ============================================================
Customer
Order
OrderItem
Restaurant
MenuItem


# ============================================================
# STEP 3 — Identify Relationships
# ============================================================
# How do your entities connect?
# Use this format: EntityA [1:N / M:N / 1:1] EntityB
#
#

  Customer   [1:N]  Order
  Restaurant [1:N]  Order
  Restaurant [1:N]  MenuItem
  Order      [1:N]  OrderItem
  MenuItem   [1:N]  OrderItem

# ============================================================
# STEP 4 — Define Attributes
# ============================================================
# For each entity, list its key fields.
#
#
Customer: id(PK), name, email, phone
Restaurant: id(PK), name, address
Order: id(PK), customer_id(FK), restaurant_id(FK), status, created_at, updated_at
MenuItem: id(PK), restaurant_id(FK), name, price
OrderItem: id(PK), order_id(FK), menu_item_id(FK), quantity, price, item_name

# ============================================================
# STEP 5 — ER Diagram (text-based)
# ============================================================
# Draw relationships using simple text:
#
# Example:
#   User
#   └──< Order
#        └──< OrderItem >── Product
#
# Your diagram:
#
#


# ============================================================
# STEP 6 — Implement Django Models
# ============================================================
# Convert your design into actual Django models below.
# TODO(human): Implement your models here.
#

from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length = 100)
    email = models.EmailField(unique = True)
    phone = models.CharField(max_length = 15)

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length = 100)
    address = models.CharField(max_length = 255)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete = models.CASCADE)
    name = models.CharField(max_length = 100)
    price = models.DecimalField(max_digits = 10, decimal_places = 2)

    def __str__(self):
        return self.name

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete = models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete = models.CASCADE)
    status = models.CharField(max_length = 20, db_index = True, choices = [
        ('PENDING', 'Pending'),
        ('READY', 'Ready'),
        ('DELIVERING', 'Delivering'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ])
    total_price = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0)
    created_at = models.DateTimeField(auto_now_add = True, db_index = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return f"Order #{self.id}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default = 1)
    price = models.DecimalField(max_digits = 10, decimal_places = 2)
    item_name = models.CharField(max_length = 100)

    def __str__(self):
        return self.item_name
