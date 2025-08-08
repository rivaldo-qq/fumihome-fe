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
