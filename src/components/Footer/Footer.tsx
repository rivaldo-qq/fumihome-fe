import { useState } from "react";
import useGrpcApi from "../../hooks/useGrpcApi";
import { getNewsletterClient } from "../../api/grpc/client";
import Swal from "sweetalert2";

function Footer() {
    const subscribeApi = useGrpcApi();
    const currentYear = new Date().getFullYear();
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await subscribeApi.callApi(getNewsletterClient().subscribeNewsletter({
            email: email,
            fullName: fullName,
        }));

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil Subscribe Newsletter'
        });

        setFullName('');
        setEmail('');
    };

    return (
        <footer className="footer-section">
            <div className="container relative">
                <div className="sofa-img">
                    <img src="/images/sofa.png" alt="Sofa" className="img-fluid" />
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="subscription-form">
                            <h3 className="d-flex align-items-center">
                                <span className="me-1">
                                    <img src="/images/envelope-outline.svg" alt="Amplop" className="img-fluid" />
                                </span>
                                <span>Langganan Newsletter</span>
                            </h3>

                            <form className="row g-3" onSubmit={handleSubmit}>
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Masukkan nama Anda"
                                        onChange={(e) => setFullName(e.target.value)}
                                        value={fullName}
                                    />
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Masukkan email Anda"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-primary">
                                        <span className="fa fa-paper-plane"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-top copyright">
                    <div className="row pt-4">
                        <div className="col-lg-6">
                            <p className="mb-2 text-center text-lg-start">
                                Copyright &copy;{currentYear}. All Rights Reserved. &mdash; Designed with love by
                                <a href="https://untree.co"> Untree.co</a> Distributed By
                                <a href="https://themewagon.com"> ThemeWagon</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer