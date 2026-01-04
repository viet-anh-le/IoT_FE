import React, { useEffect, useState } from "react";
import {
  Search,
  Add,
  Person,
  AdminPanelSettings,
  CheckCircle,
  Cancel,
  Edit,
  DeleteOutline,
  MoreHoriz,
} from "@mui/icons-material";
import { User, Pagination } from "@/types/user.type";
import { userService } from "@/services/user.service";
import { UpdateUserPayload } from "@/services/user.service";

import AddUserModal from "@/components/pages/user/AddUserModal";
import EditUserModal from "@/components/pages/user/EditUserModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const fetchUsers = async (offset = 0, search = "") => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(
        pagination.limit,
        offset,
        search
      );
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(0, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pagination.limit;
    fetchUsers(newOffset, searchTerm);
  };

  const handleAddUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      await fetchUsers(0, searchTerm);
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (id: string, data: UpdateUserPayload) => {
    try {
      await userService.updateUser(id, data);
      alert("Cập nhật thành công!");
      fetchUsers(0, searchTerm);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật");
    }
  };

  const onDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await userService.deleteUser(userToDelete.id);

      setDeleteDialogOpen(false);
      setUserToDelete(null);

      if (users.length === 1 && pagination.offset > 0) {
        fetchUsers(pagination.offset - pagination.limit, searchTerm);
      } else {
        fetchUsers(pagination.offset, searchTerm);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa người dùng");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-[1600px] mx-auto">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-10 shadow-2xl shadow-blue-900/20 text-white overflow-hidden isolate">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Quản lý người dùng
            </h1>
            <p className="text-blue-200/80 text-base font-medium max-w-xl">
              Danh sách tài khoản và phân quyền truy cập hệ thống. Quản lý trạng
              thái hoạt động và vai trò người dùng.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-semibold shadow-xl transition-all duration-300 flex items-center gap-3 active:scale-95"
          >
            <div className="bg-blue-500 group-hover:bg-blue-600 text-white p-1 rounded-lg transition-colors">
              <Add fontSize="small" />
            </div>
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative group w-full sm:w-96 transition-all duration-300 focus-within:w-full sm:focus-within:w-[450px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-0 ring-1 ring-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg focus:shadow-blue-500/10 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-xl text-sm font-medium text-slate-600">
            <span>Tổng cộng:</span>
            <span className="bg-white px-2 py-0.5 rounded-md shadow-sm text-slate-900 font-bold border border-slate-200">
              {pagination.total}
            </span>
            <span>người dùng</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 backdrop-blur border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-5 first:pl-8 last:pr-8">
                  Thông tin người dùng
                </th>
                <th className="px-6 py-5">Vai trò</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5">Ngày tham gia</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-slate-100 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      </div>
                      <p className="text-slate-400 font-medium text-sm">
                        Đang đồng bộ dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Person style={{ fontSize: 48 }} />
                    </div>
                    <p className="text-slate-500 font-medium">
                      Không tìm thấy kết quả nào
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Thử thay đổi từ khóa tìm kiếm
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-slate-50/80 transition-all duration-200"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white transition-transform group-hover:scale-105 group-hover:rotate-3
                            ${
                              user.role === "admin"
                                ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-fuchsia-500/20"
                                : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-cyan-500/20"
                            }`}
                        >
                          {user.role === "admin" ? (
                            <AdminPanelSettings />
                          ) : (
                            <Person />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-base group-hover:text-blue-700 transition-colors">
                            {user.username}
                          </span>
                          <span className="text-slate-400 text-sm font-medium font-mono">
                            {user.gmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide shadow-sm
                        ${
                          user.role === "admin"
                            ? "bg-violet-50 text-violet-700 border-violet-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.role === "admin"
                              ? "bg-violet-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                        {user.role.toUpperCase()}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {user.is_active ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50/50 text-emerald-700 text-xs font-bold shadow-sm">
                          <CheckCircle
                            style={{ fontSize: 14 }}
                            className="text-emerald-500"
                          />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 text-rose-700 text-xs font-bold shadow-sm">
                          <Cancel
                            style={{ fontSize: 14 }}
                            className="text-rose-500"
                          />
                          <span>Inactive</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-600 font-medium text-sm">
                          {new Date(user.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span className="text-slate-400 text-xs mt-0.5">
                          {new Date(user.created_at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                          title="Chỉnh sửa"
                        >
                          <Edit fontSize="small" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(user)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
                          title="Xóa"
                        >
                          <DeleteOutline fontSize="small" />
                        </button>
                      </div>
                      <div className="opacity-100 group-hover:opacity-0 absolute right-8 top-1/2 -translate-y-1/2 transition-opacity duration-200">
                        <MoreHoriz className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > 0 && (
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-500">
              Trang{" "}
              <span className="text-slate-900 font-bold">{currentPage}</span> /{" "}
              {totalPages}
            </span>

            <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                Trước
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1"></div>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3)
                  pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all shadow-sm
                      ${
                        currentPage === pageNum
                          ? "bg-slate-900 text-white shadow-slate-900/20 scale-105"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <div className="h-4 w-px bg-slate-200 mx-1"></div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasMore && currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />
      <EditUserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSubmit={handleUpdateUser}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa người dùng "${userToDelete?.username}"? Hành động này không thể hoàn tác.`}
        isLoading={isDeleting}
        confirmText="Xóa ngay"
      />
    </div>
  );
};

export default UserList;
