import { useNavigate } from "react-router-dom";
import GlossaryCard from "../../../Application/sharedComponents/glossaryCard";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import BackButton from "../CredForm/Components/BackButton";

const Glossary = () => {
  const navigate = useNavigate();

  return (
    <div>
      <BackButton label="Go back" onClick={() => navigate("/")} paddingTop={0} />
      <div style={{height: "20px"}}></div>
      <PageTitle title={"Glossary"} subtitle={"Terms and definitions"} />
      <fieldset>
        <GlossaryCard title={"National Provider Identifier (NPI):"}>
          <p className="mx-5 mb-7">
            The Administrative Simplification provisions of the Health Insurance
            Portability and Accountability Act of 1996 (HIPAA) mandated the
            adoption of a standard, unique health identifier for each health
            care provider. NPI stands for National Provider Identifier. It is a
            unique identification number assigned to healthcare providers in the
            United States. The NPI is a 10-digit alphanumeric identifier that is
            used to identify individual healthcare providers, such as
            physicians, nurses, dentists, and other healthcare professionals, as
            well as organizations, such as hospitals, clinics, and healthcare
            facilities. The NPI was introduced as part of the Health Insurance
            Portability and Accountability Act (HIPAA) in 2004. Its purpose is
            to improve the efficiency and effectiveness of electronic
            transactions and communications in the healthcare industry.
          </p>

          <span>The NPI serves several important functions:</span>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Provider Identification: </span>The
                NPI serves as a standardized identifier for healthcare
                providers, replacing various other identification numbers that
                were previously used. It ensures consistency and accuracy in
                provider identification across different healthcare systems and
                transactions.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Claims Processing: </span>Insurance
                companies and other payers use the NPI to process healthcare
                claims. By using the NPI, providers can be accurately identified
                and reimbursed for their services
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Electronic Health Records (EHRs):{" "}
                </span>
                The NPI is often included in electronic health records and other
                health information systems. It helps link patient information to
                the specific healthcare provider who rendered the care.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Provider Directories: </span>NPI
                information is maintained in a National Plan and Provider
                Enumeration System (NPPES) database. This information is used to
                create provider directories that assist patients and other
                entities in finding and verifying healthcare providers.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Data Analytics and Research: </span>
                The NPI allows for accurate tracking and analysis of healthcare
                provider data. Researchers, public health agencies, and
                policymakers can use NPI data to study trends, access healthcare
                quality, and monitor provider networks.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title={"Healthcare Provider: "}>
          <p className="mx-5 mb-7">
            Under the Medicaid and Medicare CMS (Centers for Medicare & Medicaid
            Services) standards, the definition of a health provider varies
            slightly for each program. Here are the general definitions:
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Medicaid: </span>In the context of
                Medicaid, a health provider refers to an individual or entity
                that is qualified to deliver healthcare services and is enrolled
                as a Medicaid provider. Medicaid providers include a wide range
                of healthcare professionals and organizations, such as
                physicians, nurse practitioners, clinics, hospitals, pharmacies,
                home health agencies, and long-term care facilities. These
                providers must meet specific qualifications and comply with
                Medicaid program rules and regulations to be eligible for
                reimbursement for the services they provide to Medicaid
                beneficiaries.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Medicare: </span>For Medicare, a
                health provider refers to an individual or entity that is
                qualified to deliver healthcare services to Medicare
                beneficiaries and is enrolled in the Medicare program. Medicare
                providers include physicians, nurse practitioners, physician
                assistants, hospitals, skilled nursing facilities, home health
                agencies, durable medical equipment suppliers, and other
                healthcare professionals and organizations. Medicare providers
                must meet certain standards and enroll in the Medicare program
                to receive payment for the services they furnish to Medicare
                beneficiaries.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Rendering NPI: ">
          <p className="ml-10">
            The Rendering NPI is used in Medicare and other healthcare
            transactions to identify the specific provider who performed the
            service or treatment. It helps in accurately attributing the service
            to the appropriate healthcare professional or entity for billing and
            reimbursement purposes. In Medicare claims, the Rendering NPI is
            typically reported in the claim form along with the associated
            service codes and other relevant information. It ensures that the
            payment for the service is made to the provider who rendered the
            care.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Social Security Number (SSN):">
          <p className="ml-10">
            Identification: The SSN serves as a unique identifier for
            individuals within the Social Security system.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Medical License:">
          <p className="ml-10">
            Medical License is the official authorization granted by a state
            licensing board or authority to a healthcare professional, typically
            a physician, to practice medicine within a specific jurisdiction.
            The medical license is a legal requirement for healthcare providers
            to engage in clinical practice and provide medical services to
            patients.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="NPI Certificate: ">
          <p className="ml-10">
            When a healthcare provider or organization applies for an NPI, they
            receive an NPI number, which serves as their unique identifier. The
            NPI number is obtained through the National Plan and Provider
            Enumeration System (NPPES), which is the system used for NPI
            registration and management. Proof of NPI registration or
            compliance.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Negative Certificate of Penal Record:">
          <p className="ml-10">
            A Negative Certificate of Penal Records, also known as a Criminal
            Record Clearance Certificate or Police Clearance Certificate, is an
            official document issued by a government authority or law
            enforcement agency that states an individual's lack of a criminal
            record or any prior convictions.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Curriculum Vitae: ">
          <p className="ml-10">
            A Curriculum Vitae (CV) is a comprehensive document that provides an
            overview of a person's educational background, work experience,
            skills, achievements, and qualifications. It is typically used when
            applying for academic positions, research positions, fellowships, or
            jobs in industries where a more detailed and extensive overview of
            one's professional history is required.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Tax ID: ">
          <p className="ml-10">
            A Tax ID, also known as a Taxpayer Identification Number, is a
            unique identification number used by individuals, businesses, and
            organizations for tax purposes. It is issued by the tax authority of
            a specific country or jurisdiction and serves as a means of
            identifying taxpayers for tax-related transactions and reporting.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Social Security Number</span>(SSN):
                In the United States, the Social Security Number is a nine-digit
                Tax ID primarily used for individuals. It is issued by the
                Social Security Administration and is used for various
                tax-related purposes, including filing income tax returns,
                reporting wages, and claiming benefits.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Employer Identification Number{" "}
                </span>
                (EIN): The Employer Identification Number is a Tax ID used by
                businesses and organizations in the United States. It is issued
                by the Internal Revenue Service (IRS) and is used for tax
                reporting, opening bank accounts, hiring employees, and other
                business-related activities.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Individual Taxpayer Identification Number{" "}
                </span>
                (ITIN): The Individual Taxpayer Identification Number is a Tax
                ID used by individuals in the United States who are not eligible
                for a Social Security Number but have a tax filing requirement.
                It is issued by the IRS for tax reporting purposes.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Corporation Certificate: ">
          <p className="ml-10">
            A Corporation Certificate, also known as a Certificate of
            Incorporation, is a legal document issued by the Department of State
            or the equivalent governing body in a specific jurisdiction. It
            signifies the formation and legal existence of a corporation within
            that jurisdiction. The Corporation Certificate generally includes
            information such as the corporation's legal name, date of
            incorporation, registered address, identification number, and any
            specific details required by the jurisdiction. It may also include
            information about the corporation's authorized shares, directors,
            and officers.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="W9: ">
          <p className="ml-10">
            Is an official document used in the United States for tax purposes.
            It is titled "Request for Taxpayer Identification Number and
            Certification" and is provided by the Internal Revenue Service
            (IRS). The purpose of the W-9 form is to gather the taxpayer
            identification information of individuals or entities who are being
            paid certain types of income.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="School of Medicine Diploma:">
          <p className="ml-10">
            Is an official document awarded to students who successfully
            complete a medical degree program at a recognized School of Medicine
            or Medical School. It signifies the individual's completion of the
            required coursework, clinical training, and other educational
            requirements necessary to become a medical doctor.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Specialty vs. Subspecialty: </span>A
                Specialty Diploma typically refers to the advanced training in a
                specific medical field, such as Pediatrics, Internal Medicine,
                Surgery, Obstetrics and Gynecology, or Psychiatry. Subspecialty
                Diplomas, on the other hand, represent further specialization
                within a specific field. For example, a pediatrician may pursue
                a Subspecialty Diploma in Pediatric Cardiology or Pediatric
                Oncology to focus on specific areas within pediatrics.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                Credentialing and Certification:{" "}
                </span>
                The Specialty and Subspecialty programs offered by Schools of
                Medicine must meet credentialing standards and requirements set
                by the relevant medical governing bodies or specialty boards.
                These boards are responsible for overseeing the certification
                and recognition of medical professionals who have completed the
                necessary training and assessments.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Eligibility and Training Duration:{" "}
                </span>
                The eligibility criteria and training duration for Specialty and
                Subspecialty programs vary depending on the specific field and
                country. Generally, these programs involve a combination of
                clinical rotations, didactic education, research, and
                examinations to ensure the acquisition of specialized knowledge
                and skills.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Medical Board Certificate:">
          <p className="ml-10">
            Medical Board Certificate, also known as a Medical Board License or
            Medical License, is an official document issued by a state or
            regional medical board or licensing authority. It grants a physician
            or medical professional the legal authority to practice medicine
            within a specific jurisdiction. Requirements: To obtain a Medical
            Board Certificate, physicians typically need to meet certain
            requirements, including completing medical education from an
            accredited institution, completing a residency program, and passing
            relevant licensing examinations. Additional requirements may include
            criminal background checks, character references, and proof of
            malpractice insurance.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="DEA Certificate: ">
          <p className="ml-10">
            Registration issued by the United States Drug Enforcement DEA
            Certificate. It grants healthcare professionals, including
            physicians, dentists, and other authorized practitioners, the legal
            authority to handle and prescribe controlled substances under the
            Controlled Substances Act (CSA) in the United States.
          </p>
        </GlossaryCard>
      </fieldset>

      <fieldset>
        <GlossaryCard title="ASSMCA Certificate: ">
          <p className="ml-10">
            The Office of Quality of the Health Services Administration and
            Against Addiction (ASSMCA) evaluates, monitors, and certifies that
            the services offered in agencies and public and private
            organizations licensed by ASSMCA for the prevention, treatment, and
            rehabilitation of individuals with mental health problems, addictive
            disorders, or substance dependence.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Continuing Education: ">
          <p className="ml-10">
            Also known as Continuing Medical Education (CME), refers to the
            ongoing educational activities and programs that physicians
            participate in to enhance their medical knowledge, skills, and
            competencies throughout their professional career.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Malpractice Insurance: ">
          <p className="ml-10">
            Also known as professional liability insurance or medical
            malpractice insurance, is a type of insurance coverage designed to
            protect healthcare professionals from financial losses and legal
            claims arising from alleged acts of negligence, errors, or omissions
            in the course of their professional duties.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Coverage: </span>Malpractice
                insurance provides coverage for healthcare professionals, such
                as physicians, surgeons, nurses, dentists, and other allied
                healthcare providers. It typically covers claims related to
                medical errors, misdiagnosis, surgical mistakes, medication
                errors, birth injuries, and other instances where the healthcare
                professional's actions or inactions may result in harm to a
                patient.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Financial Protection: </span>
                Malpractice insurance offers financial protection to healthcare
                professionals by covering the costs associated with legal
                defense, settlements, and judgments in malpractice lawsuits. It
                helps mitigate the financial risks and potential liabilities
                that may arise from such claims, which can be substantial and
                potentially devastating to an individual's or a healthcare
                organization's finances.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Coverage Limits: </span>Malpractice
                insurance policies have coverage limits, which represent the
                maximum amount that the insurer will pay for a claim. These
                limits can vary depending on the policy and insurer. It's
                important for healthcare professionals to review and understand
                the coverage limits and ensure they have adequate coverage for
                their practice and potential liabilities.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Professional Liability Insurance Certificate:">
          <p className="ml-10">
            Is a document issued by an insurance company that serves as proof of
            a professional's liability insurance coverage. It provides
            information about the insurance policy, including the policyholder's
            name, the coverage limits, effective dates, and other relevant
            details.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Proof of Insurance: </span>The
                certificate serves as evidence that the policyholder has an
                active professional liability insurance policy in place. It
                verifies that the individual or organization has obtained
                coverage to protect against claims of professional negligence,
                errors, or omissions.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Policyholder Information: </span>The
                certificate includes the name of the policyholder, which could
                be an individual professional, a healthcare organization, a
                consulting firm, or any entity that requires professional
                liability coverage. It may also include contact information for
                the policyholder or their representative.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Coverage Details: </span>The
                certificate provides information about the coverage limits and
                any applicable deductibles. It outlines the specific types of
                risks or liabilities covered by the insurance policy, which may
                vary depending on the profession or industry. For example,
                medical professionals may have coverage for medical malpractice,
                while consultants may have coverage for professional errors or
                advice.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Effective Dates: </span>The
                certificate indicates the start and end dates of the insurance
                coverage period. It is important for the policyholder to review
                the effective dates to ensure that the coverage is in force
                during the desired period.{" "}
              </p>
            </li>
            <li className="mt-3">
              <p>
              <span className="font-bold">Insurance Company Information: </span> 
                The certificate typically
                includes details about the insurance company providing the
                coverage, including the name, contact information, and sometimes
                the policy number. This information allows interested parties,
                such as clients or regulatory bodies, to verify the authenticity
                and validity of the insurance coverage.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Additional Insureds: </span>In some
                cases, the certificate may list additional insured parties.
                These are individuals or organizations that are also covered
                under the policyholder's professional liability insurance, often
                as a requirement or as a result of contractual agreements.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Attestation: ">
          <p className="ml-10">
            Refers to the act of providing a statement or verification of a
            fact, event, document, or process by a trusted individual or entity.
            It involves confirming or affirming the accuracy, truthfulness, or
            authenticity of something through a formal declaration or written
            statement.
          </p>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Disclosure of Authorization, Ownership & Control Interest:">
          <p className="ml-10">
            Refers to the requirement for individuals or entities to provide
            information about their financial interests, ownership stakes, and
            control positions in a business or organization.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Financial Interests: </span>The
                disclosure typically involves reporting any financial interests
                held by individuals or entities in a business or organization.
                This can include ownership of shares or stock, partnership
                interests, membership interests, equity holdings, or any other
                form of financial investment that confers ownership or financial
                benefit.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Ownership Stake: </span>The
                disclosure requires individuals or entities to disclose the
                extent of their ownership stake in the business or organization.
                This may include the percentage of ownership, voting rights, or
                other measures of control or influence over the decision-making
                process.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Control Positions: </span>
                Individuals or entities with significant control or
                decision-making authority in a business or organization are
                required to disclose their positions of control. This can
                include executive roles, board memberships, directorships, or
                other positions that grant the power to make strategic or
                operational decisions.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Transparency and Accountability:{" "}
                </span>
                The purpose of the disclosure is to promote transparency and
                accountability by ensuring that relevant parties are aware of
                any potential conflicts of interest or undue influence that may
                arise from financial interests or control positions. It allows
                stakeholders to assess the potential impact of these interests
                on decision-making processes and take appropriate measures to
                mitigate any conflicts.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Legal and Regulatory Compliance:{" "}
                </span>
                Disclosure of Authorization, Ownership & Control Interest
                requirements may stem from various legal and regulatory
                frameworks, such as corporate governance regulations, securities
                laws, government contracts, or industry-specific regulations.
                These requirements are designed to protect the interests of
                stakeholders, prevent fraudulent activities, and maintain the
                integrity of business operations.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Reporting and Documentation: </span>
                Individuals or entities are typically required to provide a
                written disclosure statement that details their authorization,
                ownership, and control interests. This statement may be
                submitted to regulatory bodies, governmental agencies, or other
                relevant parties as required by law or contract.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Provider Medicaid ID Letter:">
          <p className="ml-10">
            Is a document issued to healthcare providers who are enrolled in the
            Medicaid program. The letter serves as confirmation of their
            enrollment as Medicaid providers and includes important information
            related to their Medicaid identification.
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Enrollment Confirmation: </span>The
                letter confirms that the healthcare provider is enrolled as a
                Medicaid provider and is authorized to render services to
                Medicaid beneficiaries.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Medicaid Provider ID: </span>The
                letter typically includes a unique identification number
                assigned to the healthcare provider, known as the Medicaid
                Provider ID. This number is used to identify the provider within
                the Medicaid system and is often required for billing and
                reimbursement purposes.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Provider Information: </span>The
                letter includes details about the healthcare provider, such as
                their name, practice or organization name, address, and contact
                information. This information helps identify the provider and
                enables communication between the provider and the Medicaid
                program.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Effective Dates: </span>The letter
                specifies the effective dates of the provider's Medicaid
                enrollment. These dates indicate the period during which the
                provider is authorized to provide services to Medicaid
                beneficiaries and receive reimbursement from the Medicaid
                program.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Reimbursement Information: </span>
                The letter may provide information on the reimbursement rates,
                fee schedules, or billing guidelines applicable to the
                provider's Medicaid services. It may also include instructions
                on how to submit claims and receive reimbursement for services
                rendered to Medicaid beneficiaries.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Compliance Requirements: </span>The
                letter may include information about the provider's obligations
                and responsibilities as a Medicaid participant. This can include
                adherence to Medicaid program rules, compliance with billing and
                documentation requirements, and participation in quality
                improvement initiatives.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
      <fieldset>
        <GlossaryCard title="Medicare Letter (PTAN):">
          <p className="ml-10">
            Also known as a{" "}
            <span className="font-bold italic">
              Provider Transaction Access Number (PTAN){" "}
            </span>
            letter, is a document issued by the Centers for Medicare and
            Medicaid Services (CMS) to healthcare providers who are enrolled in
            the Medicare program. The letter confirms the provider's enrollment
            and includes important information related to their Medicare
            identification.
          </p>
          <p className="ml-5 mt-8">
            Here are some key points about a Medicare Letter (PTAN):
          </p>
          <ul className="list-disc ml-10">
            <li className="mt-3">
              <p>
                <span className="font-bold">Enrollment Confirmation: </span>The
                letter serves as confirmation that the healthcare provider is
                enrolled in the Medicare program and is authorized to provide
                services to Medicare beneficiaries.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Provider Transaction Access Number (PTAN):{" "}
                </span>
                The letter includes a unique identification number assigned to
                the healthcare provider, known as the PTAN. This number is used
                to identify the provider within the Medicare system and is often
                required for billing and reimbursement purposes.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Provider Information: </span>The
                letter contains details about the healthcare provider, including
                their name, practice or organization name, address, and contact
                information. This information helps identify the provider and
                enables communication between the provider and the Medicare
                program.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Effective Dates: </span>The letter
                specifies the effective dates of the provider's Medicare
                enrollment. These dates indicate the period during which the
                provider is authorized to render services to Medicare
                beneficiaries and receive reimbursement from the Medicare
                program.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">
                  Billing and Reimbursement Information:{" "}
                </span>
                The letter may provide information on Medicare billing
                requirements, reimbursement rates, and fee schedules applicable
                to the provider's services. It may include instructions on how
                to submit claims, obtain reimbursement, and comply with
                Medicare's billing guidelines.
              </p>
            </li>
            <li className="mt-3">
              <p>
                <span className="font-bold">Compliance Requirements: </span>The
                letter may outline the provider's obligations and
                responsibilities as a Medicare participant. This can include
                compliance with Medicare program rules, documentation
                requirements, quality reporting initiatives, and participation
                in audits or reviews.
              </p>
            </li>
          </ul>
        </GlossaryCard>
      </fieldset>
    </div>
  );
};

export default Glossary;
