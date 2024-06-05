export const Attestation = (name: string, date: string) => {
    return (`
    <!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link href="https://fonts.cdnfonts.com/css/cormorant-garamond" rel="stylesheet">
    <link href="https://db.onlinewebfonts.com/c/029177df870cce2b384f0610a6e1f82a?family=Montserrat+Light" rel="stylesheet">
    <link rel="stylesheet" href="../public/css/styles.css">
    <meta charset="utf-8">
</head>
<body>
    <style>
        body{
            width: 8.5in;
        }
        p{
            font-family: 'Times New Roman',serif;
            font-size: 12.52pt;
            /* text-align: justify; */
        }
    </style>
	<div class="container-fluid" id="pdf-content">
        <div style="margin: 40px 10px 20px 20px;">
            <p>Dr. ${name}</p>
            <p style="margin-top: -5px;">${date}</p>
            <p style="font-weight: 600;">Subject: Attestation of Originality and Authenticity of Information for Credentialing Process,
                by the Provider or Delegate Credentialing Professional
            </p>
            <p>To Whom It May Concern,</p>

            <div style="margin-left: 20px;">
                <p>I, Dr. ${name} attest that all the information and documentation provided through the OCS
                    Credentials System for the purpose to complete my credentialing process with Health
                    Insurance Companies and Covered Entities is original, accurate, and authentic, in
                    accordance with the regulations and guidelines set forth by the Commonwealth of Puerto Rico.
                </p>

                <p>I understand the importance of providing truthful and complete information for credentialing.
                    I take full responsibility for the accuracy and authenticity of all submitted documentation
                    by me or my appointed Delegated Credentialing Professional.
                </p>
                <p>I confirm that I have not provided any false or misleading information while uploading documents
                    to the OCS Credentialing System. I further acknowledge that any misrepresentation or
                    falsification of information may result in legal and regulatory consequences, including but not
                    limited to the revocation of credentials and potential legal actions.
                </p>
                <p>I am committed to upholding the highest standards of professionalism and integrity in my
                    practice. I assure you that I will promptly notify you of any changes or updates to my
                    information that may affect my eligibility or qualifications. By completing the document
                    upload process in the OCS Credentialing System and allowing the insurance companies or
                    covered entities to collect the documentation and information from there, I affirm that
                    I have read and understood the terms of this attestation.
                </p>
                <p>I verify that the information provided is accurate, original, and authentic to the best of my
                    knowledge. I have attached all relevant documents that the OCS Credentials System
                    has requested for the completion of the credentialing process. Please do not hesitate to
                    contact me if any additional information or documentation is necessary.
                </p>
            </div>

            <p>Sincerely,</p>

            <p>Dr. ${name}</p>
        </div>
        <footer>
            <div class="text-center">
                <hr size="1" width="100%" color="black">
                <p class="text-center" style="font-family: Montserrat Light; font-size: 10pt; font-weight: 600">
                <b>This is NOT an official document. It is a preview of the official attestation 
                <br>that will be stored in your documents once you submit the form.
                </p>
            </div>
        </footer>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js" integrity="sha384-Rx+T1VzGupg4BHQYs2gCW9It+akI2MM/mndMCy36UVfodzcJcF0GGLxZIzObiEfa" crossorigin="anonymous"></script>
</body>
</html>
`);
};