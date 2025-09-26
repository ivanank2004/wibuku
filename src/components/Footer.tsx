import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-800 text-white mt-16">
            <div className="container mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between text-lg">
                <p className="mb-4 sm:mb-0 font-semibold">
                    © {new Date().getFullYear()} Created by{" "}
                    <span className="text-blue-200">Ivan</span>
                </p>

                <p className="text-blue-100 text-center sm:text-right">
                    Data powered by{" "}
                    <a
                        href="https://docs.api.jikan.moe/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-300 font-medium"
                    >
                        Jikan API
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
