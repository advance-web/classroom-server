# Server explanation

## App, Server, Database connect
App: xác định route, các vấn đề về api
server: Các config về server, liên kế db

## Model
Định nghĩa bảng trong database bao gồm định nghĩa bảng và các tiền xử lý liên quan tới bảng.

## Controller
Các hàm xử lý req (yêu cầu) và trả về res(phản hồi) . Xử lý input nhận vào và gọi các hàm trong model để thao tác với db.
Nên tham khảo các controller về xử lý xác thực, phân quyền trong authController

## Route
Xác định các route nào thì sử dụng controller nào.

## config.env
Lưu các thông số về ứng dụng có thể tủy chỉnh kết nối db ở đây

## utils
Các hàm helper, chủ yếu là để refactor, sử dụng lại

## public
Chứa các file ảnh, css, js. Hiện tại chủ yếu là dùng để lưu ảnh.

## dev-data
Các file data json tĩnh dùng để test trước khi thao tác với db. Có thể tạo các hàm để import những data tĩnh này vào db. 

# How to use
1. Cài đặt các gói thông qua npm
> npm i
2. Chạy ứng dụng (start)
> npm start

