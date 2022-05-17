package ru.mirea.userservice.entities;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table(name = "buildings")
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String header;
    @Column(name = "description", length = 2048)
    private String description;
    @Column(name = "contacts", length = 2048)
    private String contacts;
    private Long price;
    private int type; // 0/1
    private String location;
    @ElementCollection
    private Collection<Long> imageIds = new ArrayList<>();
    private Long userId;
    private String userName;
    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    private Collection<Comment> comments = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContacts() {
        return contacts;
    }

    public void setContacts(String contacts) {
        this.contacts = contacts;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Collection<Long> getImageIds() {
        return imageIds;
    }

    public void setImageIds(Collection<Long> imageIds) {
        this.imageIds = imageIds;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Collection<Comment> getComments() {
        return comments;
    }

    public void setComments(Collection<Comment> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + id +
                ", header='" + header + '\'' +
                ", description='" + description + '\'' +
                ", contacts='" + contacts + '\'' +
                ", price=" + price +
                ", type=" + type +
                ", location='" + location + '\'' +
                ", imageIds=" + imageIds +
                ", userId=" + userId +
                '}';
    }
}
