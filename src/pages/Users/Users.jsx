import { useEffect, useState } from "react";

import Card from "../../components/ui/Card/Card";
import Table from "../../components/ui/Table/Table";
import PageHeader from "../../components/ui/PageHeader/PageHeader";

import userService from "../../services/userService";

import Swal from "sweetalert2";

import "./Users.css";


const columns = [

    {
        header: "Username",
        accessor: "username"
    },

    {
        header: "Nama",
        accessor: "nama"
    },

    {
        header: "Role",
        accessor: "role"
    },

    {
        header: "Status",
        render: (row) => (

            <span
                className={
                    row.aktif
                        ? "user-status aktif"
                        : "user-status nonaktif"
                }
            >
                {row.aktif ? "Aktif" : "Nonaktif"}
            </span>

        )
    },

    {
        header: "Dibuat",
        render: (row) =>
            new Date(row.created_at)
                .toLocaleDateString("id-ID")
    }

];


function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [saving, setSaving] = useState(false);


    const [form, setForm] = useState({

        email: "",

        username: "",

        nama: "",

        password: "",

        role: "user",

        aktif: true

    });


    useEffect(() => {

        loadUsers();

    }, []);


    async function loadUsers() {

        setLoading(true);


        const { data, error } =
            await userService.getUsers();


        if (error) {

            console.error(
                "GET USERS ERROR :",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message
            });

            setUsers([]);

            setLoading(false);

            return;

        }


        setUsers(data ?? []);

        setLoading(false);

    }


    function handleChange(e) {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm({

            ...form,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        });

    }


    async function handleSubmit(e) {

        e.preventDefault();


        setSaving(true);


        console.log(
            "FORM CREATE USER :",
            form
        );


        const { data, error } =
            await userService.createUser(form);


        console.log(
            "CREATE USER DATA :",
            data
        );


        console.log(
            "CREATE USER ERROR :",
            error
        );


        if (error) {

            console.error(
                "CREATE USER ERROR DETAIL :",
                error
            );


            let detail =
                error.message ||
                "Terjadi kesalahan.";


            try {

                if (error.context) {

                    const response =
                        await error.context.json();


                    console.error(
                        "EDGE FUNCTION RESPONSE JSON :",
                        JSON.stringify(response, null, 2)
                    );


                    detail =
                        response.error ||
                        JSON.stringify(response);

                }

            } catch (e) {

                console.error(
                    "GAGAL BACA RESPONSE EDGE FUNCTION :",
                    e
                );

            }


            Swal.fire({

                icon: "error",

                title: "Gagal Membuat User",

                text: detail

            });


            setSaving(false);

            return;

        }


        if (data?.error) {

            console.error(
                "EDGE FUNCTION ERROR :",
                data.error
            );


            Swal.fire({

                icon: "error",

                title: "Gagal Membuat User",

                text: data.error

            });


            setSaving(false);

            return;

        }


        console.log(
            "USER BERHASIL DIBUAT :",
            data
        );


        Swal.fire({

            icon: "success",

            title: "Berhasil",

            text: "User berhasil dibuat."

        });


        setForm({

            email: "",

            username: "",

            nama: "",

            password: "",

            role: "user",

            aktif: true

        });


        setShowForm(false);

        setSaving(false);


        loadUsers();

    }


    return (

        <>

            <PageHeader

                title="Management User"

                subtitle="Kelola pengguna aplikasi Stock Opname."

            />


            <Card>


                <div className="users-toolbar">

                    <button

                        className="add-user-btn"

                        onClick={() =>
                            setShowForm(!showForm)
                        }

                    >
                        + Tambah User
                    </button>

                </div>


                {showForm && (

                    <form

                        className="user-form"

                        onSubmit={handleSubmit}

                    >


                        <div className="form-grid">


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input

                                    type="email"

                                    name="email"

                                    value={form.email}

                                    onChange={handleChange}

                                    placeholder="user@email.com"

                                    required

                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Username
                                </label>

                                <input

                                    type="text"

                                    name="username"

                                    value={form.username}

                                    onChange={handleChange}

                                    placeholder="username"

                                    required

                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Nama
                                </label>

                                <input

                                    type="text"

                                    name="nama"

                                    value={form.nama}

                                    onChange={handleChange}

                                    placeholder="Nama lengkap"

                                    required

                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input

                                    type="password"

                                    name="password"

                                    value={form.password}

                                    onChange={handleChange}

                                    placeholder="Minimal 6 karakter"

                                    minLength={6}

                                    required

                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                >
                                    <option value="user">
                                        User
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>

                            </div>


                            <div className="form-group checkbox-group">

                                <label>

                                    <input

                                        type="checkbox"

                                        name="aktif"

                                        checked={form.aktif}

                                        onChange={handleChange}

                                    />

                                    Aktif

                                </label>

                            </div>


                        </div>


                        <div className="form-actions">


                            <button

                                type="button"

                                onClick={() =>
                                    setShowForm(false)
                                }

                                disabled={saving}

                            >
                                Batal
                            </button>


                            <button

                                type="submit"

                                disabled={saving}

                            >

                                {saving
                                    ? "Menyimpan..."
                                    : "Simpan User"
                                }

                            </button>


                        </div>


                    </form>

                )}


                {loading ? (

                    <div className="users-loading">

                        Memuat data user...

                    </div>

                ) : (

                    <Table

                        columns={columns}

                        data={users}

                        emptyMessage="Belum ada user."

                    />

                )}


            </Card>

        </>

    );

}


export default Users;