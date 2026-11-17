package com.dhanshri.bookstore.repository;

import com.dhanshri.bookstore.model.Order;
import com.dhanshri.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
