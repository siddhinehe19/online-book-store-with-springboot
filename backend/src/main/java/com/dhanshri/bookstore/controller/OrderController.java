package com.dhanshri.bookstore.controller;

import com.dhanshri.bookstore.dto.OrderRequest;
import com.dhanshri.bookstore.model.Order;
import com.dhanshri.bookstore.model.User;
import com.dhanshri.bookstore.repository.BookRepository;
import com.dhanshri.bookstore.repository.OrderRepository;
import com.dhanshri.bookstore.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orders;
    private final UserRepository users;
    private final BookRepository books;

    public OrderController(
            OrderRepository orders,
            UserRepository users,
            BookRepository books) {

        this.orders = orders;
        this.users = users;
        this.books = books;
    }

    // =========================
    // CREATE ORDER
    // =========================

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody OrderRequest request,
            Authentication auth) {

        // Get currently logged-in user
        User user = users
                .findByEmail(auth.getName())
                .orElseThrow();

        // Create new order
        Order order = new Order();

        order.setUser(user);
        order.setTotal(request.total());
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        // Save order
        Order savedOrder = orders.save(order);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // =========================
    // GET MY ORDERS
    // =========================

    @GetMapping
    public List<Order> mine(Authentication auth) {

        // Get currently logged-in user
        User user = users
                .findByEmail(auth.getName())
                .orElseThrow();

        // Return user's orders
        return orders.findByUserOrderByCreatedAtDesc(user);
    }
}