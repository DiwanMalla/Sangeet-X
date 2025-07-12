"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  Activity,
  UserPlus,
  Users as UsersIcon,
  Crown,
  User,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  lastActive: string;
  songsUploaded: number;
  playlists: number;
  followers: number;
  following: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    adminUsers: 0,
  });

  const roles = ["all", "admin", "moderator", "user"];
  const statuses = ["all", "active", "inactive", "suspended"];

  const filterUsers = useCallback(() => {
    let filtered = [...users];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedRole, selectedStatus, filterUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          role: "admin",
          status: "active",
          joinedAt: "2023-01-15",
          lastActive: "2024-07-06",
          songsUploaded: 45,
          playlists: 12,
          followers: 230,
          following: 180,
        },
        {
          id: "2",
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b1ad?w=150&h=150&fit=crop&crop=face",
          role: "user",
          status: "active",
          joinedAt: "2023-03-22",
          lastActive: "2024-07-05",
          songsUploaded: 0,
          playlists: 8,
          followers: 45,
          following: 67,
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          role: "moderator",
          status: "active",
          joinedAt: "2023-02-10",
          lastActive: "2024-07-06",
          songsUploaded: 23,
          playlists: 15,
          followers: 120,
          following: 89,
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          role: "user",
          status: "inactive",
          joinedAt: "2023-05-08",
          lastActive: "2024-06-15",
          songsUploaded: 0,
          playlists: 3,
          followers: 12,
          following: 25,
        },
      ];

      setUsers(mockUsers);

      // Calculate stats
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(
        (user) => user.status === "active"
      ).length;
      const newUsersThisMonth = mockUsers.filter((user) => {
        const joinDate = new Date(user.joinedAt);
        const now = new Date();
        return (
          joinDate.getMonth() === now.getMonth() &&
          joinDate.getFullYear() === now.getFullYear()
        );
      }).length;
      const adminUsers = mockUsers.filter(
        (user) => user.role === "admin"
      ).length;

      setStats({
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        adminUsers,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: User["status"]
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator":
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UsersIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-lg font-semibold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p className="text-lg font-semibold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New This Month
                </p>
                <p className="text-lg font-semibold">
                  {stats.newUsersThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admins
                </p>
                <p className="text-lg font-semibold">{stats.adminUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all"
                      ? "All Roles"
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      {getRoleIcon(user.role)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Last active{" "}
                        {new Date(user.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="text-center">
                      <p className="font-medium">{user.songsUploaded}</p>
                      <p className="text-xs">Songs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{user.playlists}</p>
                      <p className="text-xs">Playlists</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{user.followers}</p>
                      <p className="text-xs">Followers</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(user.status)}

                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as User["role"]
                        )
                      }
                      className="text-sm px-2 py-1 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>

                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(
                          user.id,
                          e.target.value as User["status"]
                        )
                      }
                      className="text-sm px-2 py-1 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>

                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ||
                selectedRole !== "all" ||
                selectedStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "No users registered yet"}
              </p>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
