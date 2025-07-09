import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_0px_rgba(233,78,45,0.2)] mb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 font-normal shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            {/* Removed Music icon */}
            <span className="font-bold text-xl text-brand-green">Apolone.</span>
          </Link>
        </div>
      </header>
      <div className="max-w-[1032px] mx-auto">
        <h1 className="font-semibold text-4xl mb-6">Terms and conditions</h1>

        <p className="mb-6">
          This Terms and Conditions (hereinafter referred to as the{" "}
          <b>"Agreement"</b> ) is made and entered into as of the date of
          acceptance of this Agreement through clicking <b>“I agree”</b>{" "}
          (hereinafter the
          <b>“Effective Date”</b> ) by and between Rapcult LLC, a limited
          liability company registered in Delaware, doing business as “Apolone”
          (hereinafter referred to as the <b>"Platform"</b> ), and the{" "}
          <b>Curator</b> (hereinafter referred to as the <b>"Curator"</b> ,{" "}
          <b>“You”</b> or <b>“Yours”</b> ).
        </p>
        <p className="mb-6">
          The Platform and the Curator are hereinafter collectively referred to
          as the “Parties” and individually as a “Party”.
        </p>

        <div className="mb-10">
          <p className="font-semibold mb-6">1. Definitions</p>

          <div className="grid grid-cols-3 gap-6">
            <p className="col-span-1">
              <b>“Acceptance Form”</b> means
            </p>
            <p className="col-span-2">
              A form that may be required to be filled out by the Curator when
              accepting a Submission, documenting the details of the acceptance
              process.
            </p>
            <p className="col-span-1">
              <b>“Artist”</b> means
            </p>
            <p className="col-span-2">Owner of a Submission.</p>
            <p className="col-span-1">
              <b>“Compensation Event”</b> means
            </p>
            <p className="col-span-2">
              An event that triggers addition of the Credits to Curator’s
              Account Balance.
            </p>
            <p className="col-span-1">
              <b>“Credit”</b> means
            </p>
            <p className="col-span-2">
              The virtual currency earned on the Platform by Curators through
              reviewing Submissions and engaging with the Platform’s features.
            </p>
            <p className="col-span-1">
              <b>“Curator Account”</b> means
            </p>
            <p className="col-span-2">
              The account is established by a Curator on the Platform, which
              allows them to manage their activities, including declining and
              accepting Submissions, adding Playlists, and earning Credits.
            </p>
            <p className="col-span-1">
              <b>“Feedback Form”</b> means
            </p>
            <p className="col-span-2">
              A form that is presented to the Curator when they decline a
              Submission, which must be filled out to provide the reason for the
              decline.
            </p>
            <p className="col-span-1">
              <b>“Placement”</b> means
            </p>
            <p className="col-span-2">
              The act of adding an accepted Submission to a Playlist, thereby
              officially includes the Submission in the Curator’s collection of
              Playlists.
            </p>
            <p className="col-span-1">
              <b>“Placement Removal”</b> means
            </p>
            <p className="col-span-2">
              The action of removing a previously placed Submission from a
              Playlist, thereby excluding the Submission from the Curator’s
              collection.
            </p>
            <p className="col-span-1">
              <b>“Playlist”</b> means
            </p>
            <p className="col-span-2">
              A curated list of songs created by a Curator on Third Party
              Platforms.
            </p>
            <p className="col-span-1">
              <b>“Playlist Tier”</b> means
            </p>
            <p className="col-span-2">
              A classification system used to categorize Playlists based on
              number of active followers, saves or subscribers of the Playlist
              on Third Party Platforms.
            </p>
            <p className="col-span-1">
              <b>“Submission”</b> means
            </p>
            <p className="col-span-2">
              A song that has been submitted by an Artist on the Platform for
              consideration to be added to a Playlist
            </p>
            <p className="col-span-1">
              <b>“Submission Acceptance”</b> means
            </p>
            <p className="col-span-2">
              The action taken by the Curator shows that, in their judgment, a
              Submission fits one or more curated Playlists and is personally
              preferred by the Curator to improve the Playlist. As a result, the
              Submission will be added to the chosen Playlist.
            </p>
            <p className="col-span-1">
              <b>“Submission Decline”</b> means
            </p>
            <p className="col-span-2">
              The action taken by the Curator shows that, in their judgment, a
              Submission did not align with one or more of the curated Playlists
              and is not personally preferred by the Curator. As a result, the
              Submission will not be placed on any of the Playlist.
            </p>
            <p className="col-span-1">
              <b>“Third Party Platforms”</b> means
            </p>
            <p className="col-span-2">
              Any external music streaming services on which the Curators run
              their Playlists including but not limited to Spotify, Apple Music,
              and YouTube Music.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">2. Purpose</p>

          <p className="mb-6">
            The purpose of this Agreement is to delineate the rights and
            responsibilities of the Curators utilizing the Platform, a
            submission matching and review tool designed to facilitate the
            discovery of new songs for inclusion in the Playlists. The Platform
            serves solely as an intermediary service that enables Curators to
            efficiently identify and review music Submissions, making them more
            visible and providing Artists a better reach and popularity.{" "}
          </p>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">3. Role of Curator</p>

          <p className="mb-6">
            The Curators acknowledge and agree that their role within the
            Platform is to evaluate submitted songs for potential fit within
            their respective Playlists. A Curator retains the sole discretion to
            accept or decline any Submission.
          </p>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">
            4. Trigger Events and Placement Expectations
          </p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">4.1</span>
            <div>
              <p className="mb-6">
                <b>Trigger Events.</b> The release of Credits to Curators shall
                be governed by two distinct trigger events, each requiring
                specific actions to be completed by the Curator:
              </p>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">4.1.1</span>
                <div>
                  <p className="mb-4">
                    <b>Submission Decline Event.</b> The decline event is
                    initiated when a Curator chooses to decline a Submission. To
                    trigger the release of Credits associated with a declined
                    Submission, the Curator must complete the following steps:
                  </p>

                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.1.1</span>
                    <p>
                      Initiate the decline window for the Submission in
                      question.
                    </p>
                  </div>
                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.1.2</span>
                    <p>Fill out and submit the accompanying Feedback Form.</p>
                  </div>
                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.1.3</span>
                    <p>
                      The successful submission of Feedback Form shall serve as
                      the trigger for the release of Credits corresponding to
                      the Submission Decline event and the Curators are hereby
                      required to provide feedback that is both thoughtful and
                      accurate in relation to each Submission Decline event. It
                      is the responsibility of the Curators to engage
                      meaningfully with the content of Submissions and to offer
                      constructive feedback in the form of selecting the most
                      fit option from the multiple-choice fields created for
                      Curators convenience that reflects a genuine assessment.
                    </p>
                  </div>
                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.1.4</span>
                    <p>
                      Submissions characterized by any of the following
                      behaviors shall be deemed a violation of this Agreement:
                      (a) Careless feedback that lacks substance or relevance,
                      (b) Repetitive responses that do not offer new insights or
                      evaluations, (c) Nonsensical commentary that fails to
                      address the content of the Submission, or (d) Submissions
                      completed without adequate attention, including but not
                      limited to instances of submitting multiple identical
                      responses or filling out feedback forms without having
                      adequately listened to or engaged with the Submission.
                    </p>
                  </div>
                  <div>
                    Such behaviors as outlined in Section 4.1.1.4. above
                    undermine the integrity of the Platform and are considered a
                    breach of the successful Submission Decline Event, thereby
                    compromising the quality and reliability of the feedback
                    process. Violations of this clause may result in actions
                    taken against the offending Curator, as defined in Section 7
                    of this Agreement.
                  </div>
                </div>
              </div>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">4.1.2</span>
                <div>
                  <p className="mb-4">
                    <b>Submission Acceptance Event.</b> The Submission
                    Acceptance event is initiated when a Curator chooses to
                    accept a Submission. To trigger the release of Credits
                    associated with an accepted submission, the Curator must
                    complete the following steps:
                  </p>

                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.2.1</span>
                    <p>
                      Initiate the accept window for the Submission in question.
                    </p>
                  </div>
                  <div className="ml-8 gap-12 flex mb-4">
                    <span className="inline-block">4.1.2.2</span>
                    <p>
                      Fill out and submit the Acceptance Form by selecting the
                      Playlists for which the Submission is being accepted.
                    </p>
                  </div>
                  <div className="ml-8 gap-12 flex">
                    <span className="inline-block">4.1.2.3</span>
                    <p>
                      The successful submission of the acceptance form shall
                      serve as the trigger for the release of Credits
                      corresponding to the Submission Acceptance event.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">4.2</span>
            <div>
              <p className="mb-4">
                <b>Submission Placement.</b> Upon accepting a Submission for
                Placement, the Curator agrees to adhere to the following
                expectations regarding the management and duration of the
                Submission’s presence on their Playlist:
              </p>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">4.2.1</span>
                <p className="mb-4">
                  <b>Timely Placement.</b> The Curator must place the accepted
                  song on a Playlist that they own and control within a period
                  of twenty-four (24) hours from the time of acceptance.
                  Placement must be confirmed via “confirm placement”
                  functionality after it has been placed in the Playlist.
                  Failure to confirm Placement on the Platform will result in
                  the Submission Accepted event being considered as failed to
                  place. Should the Curator fail to place the accepted song on
                  their playlist within the stipulated twenty-four (24) hour
                  timeframe, this shall also constitute a violation of this
                  section. The Platform reserves the right to impose penalties
                  for such failure, as mentioned in section 7 of this Agreement.
                </p>
              </div>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">4.2.2</span>
                <p className="mb-4">
                  <b>Minimum Retention Period.</b> Once placed, the Curator is
                  required to maintain the song on the designated Playlist for a
                  minimum duration as defined by the specific campaign
                  parameters. In the absence of a defined minimum duration, the
                  default retention period shall be thirty (30) days. The
                  Curator acknowledges that this retention period is essential
                  for fulfilling the promotional objectives of the campaign. Any
                  early removal of the accepted Submission from the Playlist
                  without providing valid justification as delineated in section
                  4.2.3. shall be deemed a violation of this section. In such
                  cases, the Curator may face penalties as mentioned in section
                  7 of this Agreement.
                </p>
              </div>
              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">4.2.3</span>
                <p className="mb-4">
                  <b>Justifiable Removal.</b> The Curator may only remove the
                  song from the Playlist prior to the completion of the minimum
                  retention period under exceptional circumstances that are
                  demonstrably justified. Such justifiable grounds may include,
                  but are not limited to, instances of copyright infringement,
                  legal disputes, or other significant issues pertaining to the
                  song or artist. The Curator must provide documented evidence
                  supporting their claim for early removal to the Platform for
                  review and approval.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">5. Compensation</p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">5.1</span>
            <div>
              <p className="mb-6">
                <b>Compensation Structure.</b> Curators shall be compensated for
                their services based on the number of Submissions reviewed,
                irrespective of whether such Submissions result in the
                acceptance of songs within Playlists Placement. The compensation
                for each Submission reviewed will be awarded in the form of
                Credits, with the specific amount of Credits contingent upon the
                Curator's designated level, Playlist Tier, and individual rating
                as determined by the Platform.
              </p>
            </div>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">5.2</span>
            <div>
              <p className="mb-6">
                <b>Compensation Conditions.</b> The disbursement of compensation
                to Curators is contingent upon the following conditions:
              </p>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">5.2.1</span>
                <div>
                  <p className="mb-4">
                    <b>Verified Playlist Ownership.</b> Curators must have
                    verified ownership of the Playlists for which they are
                    submitting content. Verification processes may include, but
                    are not limited to, confirming ownership through the
                    Platform’s designated methods.
                  </p>
                </div>
              </div>
              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">5.2.2</span>
                <div>
                  <p className="mb-4">
                    <b>Completion of Profile/KYC.</b> Curators are required to
                    complete their profiles in full, including any necessary KYC
                    documentation as mandated by the Platform. This may involve
                    providing personal identification and other relevant
                    information to ensure compliance with applicable
                    regulations.
                  </p>
                </div>
              </div>
              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">5.2.3</span>
                <div>
                  <p className="mb-4">
                    <b>Adherence to this Agreement.</b> All Curators must adhere
                    to the policies and terms of service as delineated in this
                    Agreement. Any failure to comply with these guidelines may
                    result in penalties as mentioned in section 7 of this
                    Agreement.
                  </p>
                </div>
              </div>

              <div>
                The Curators hereby acknowledge and agree that their Credits
                compensation structure is designed to ensure neutrality and
                eliminate any bias. Specifically, Curators will receive equal
                rewards for both the Submission Acceptance and Submission
                Decline events, thereby creating an unbiased incentive framework
                with regards to favoring or incentivizing one type of decision
                of the other.
              </div>
            </div>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">5.3</span>
            <div>
              <p className="mb-6">
                <b>Compensation Terms.</b> Credits earned by Curators through
                these compensation trigger events as mentioned in section 4.1 of
                this Agreement shall be credited to the respective Curator
                Account. Curators acknowledge that all compensation is subject
                to verification by the Platform and that any discrepancies or
                disputes regarding compensation shall be addressed in accordance
                with the Platform’s dispute resolution procedures. By
                participating in the Platform, Curators agree to these
                compensation terms and acknowledge their understanding of the
                conditions under which compensation will be awarded.
              </p>
            </div>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">5.4</span>
            <div>
              <p className="mb-6">
                <b>Apolone Credits.</b> The Curators hereby acknowledge and
                agree that their compensation shall be disbursed in the form of
                Credits credited to their respective accounts. Such Credits may
                be converted into United States Dollars (USD) or other available
                currencies during the payout process. Notwithstanding the
                foregoing, the Platform shall execute the payout process
                exclusively in United States Dollars (USD).
              </p>
            </div>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">5.5</span>
            <div>
              <p className="mb-6">
                <b>Request for Payout.</b> In the event that the Curator desires
                to initiate a payout of their accumulated Credits, such request
                must be submitted through the designated "Request Payout" form
                available on the Platform. The payout amount shall be calculated
                based on the total number of Credits held by the Curator,
                wherein each Credit is valued at an amount of $1 USD. The
                Platform reserves the right to modify the value of each Credit
                at its sole discretion, and such changes may occur from time to
                time without prior notice to the Curator.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">6. Prohibited Conduct</p>
          <p>
            Curators must refrain from the following prohibitions to maintain
            the integrity and fairness of the service. Any violation of these
            prohibitions will result in immediate action and will attract
            penalties as mentioned in section 7 of this Agreement.
          </p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">6.1</span>
            <div>
              <p className="mb-6">
                <b>No Incentivized Placement.</b>{" "}
              </p>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">6.1.1</span>
                <div>
                  <p className="mb-4">
                    <b>Prohibition of Paid Placement.</b> Curators are expressly
                    prohibited from engaging in any form of paid Placement or
                    compensation in exchange for the inclusion of songs, albums,
                    or artists on Playlists. This prohibition extends to any
                    arrangements where monetary or non-monetary compensation is
                    offered, promised, or implied as a condition for Placement
                    on a Playlist or other influence over the content of
                    Playlists.
                  </p>
                </div>
              </div>
              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">6.1.2</span>
                <div>
                  <p className="mb-4">
                    <b>Conditional Compensation.</b> It is hereby reiterated
                    that any Credits received by Curators shall not be
                    conditional upon the outcome of the review process or the
                    placement of any tracks on playlists. Curators acknowledge
                    and agree that compensation does not equate to, nor should
                    it be interpreted as, a sale or purchase of playlist spots.
                    The Platform explicitly does not sell playlist placements,
                    and all curation decisions are made independently and based
                    solely on artistic merit and relevance to the Playlist's
                    theme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">6.2</span>
            <div>
              <p className="mb-6">
                <b>
                  Violation of terms and conditions of Third-Party Platforms.
                </b>{" "}
                The Curator hereby acknowledges and agrees that they shall not
                violate any terms, conditions, or guidelines established by any
                Third-Party Platform whose services or products are involved in
                the Platform, Submissions, Playlists etc. The Curator
                understands that any such violation may result in risks to the
                artists and the Platform, including but not limited to
                reputational damage and other liabilities. The Curator accepts
                full responsibility and liability for any breach of the terms
                and conditions of any Third-Party Platform, and the Platform
                shall bear no responsibility for such violations as delineated
                in section 12.2 of this Agreement.
              </p>
            </div>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">6.3</span>
            <div>
              <p className="mb-6">
                <b>Botted Playlists and Artificial Engagement.</b> Curators are
                strictly prohibited from using botted playlists or acquiring
                fake or farmed followers and plays. Any attempt to inflate
                follower counts or streaming metrics through artificial means is
                a severe violation of the terms of this Agreement. This
                includes, but is not limited to, employing software or services
                designed to artificially increase play counts or engagement
                metrics.
              </p>
            </div>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">6.4</span>
            <div>
              <p className="mb-6">
                <b>Use of Automation Tools.</b> The use of scripts, bots, or any
                form of automation to manage submissions, reviews, feedback,
                engagement on the Platform is expressly prohibited. Curators are
                expected to engage with the Platform organically and
                authentically.
              </p>
            </div>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">6.5</span>
            <div>
              <p className="mb-6">
                <b>Direct Communication with Artists.</b> Curators must not
                engage, communicate, or come into contact with Artists outside
                of the Platform. All interactions with artists should occur
                within the confines of the Platform to ensure compliance with
                community standards and privacy regulations.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">7. Penalties</p>
          <p>
            In the event that the Curator breaches any of the terms outlined in
            this Agreement, whether explicitly stated or implied, the following
            penalties shall apply. These measures are designed to uphold the
            integrity of the Platform and ensure compliance with its guidelines:
          </p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.1</span>
            <p className="mb-6">
              <b>Decrease in Curator Score.</b> The Curator's score on the
              Platform reflects their adherence to the terms of this Agreement
              and their overall performance. In cases of breach, the Platform
              will assess the severity of the infraction and reduce the
              Curator's score accordingly. The criteria for determining the
              severity may include factors such as the frequency of breaches,
              the impact on users or other Curators, and whether the breach was
              intentional or accidental.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.2</span>
            <p className="mb-6">
              <b>Decrease of Playlist Score.</b> Any Playlists affected by the
              breach will also experience a reduction in their scores. This
              decrease aims to maintain the quality and reliability of content
              available on the Platform. The extent of the decrease will be
              proportional to how significantly the breach impacted on the
              Playlist's integrity or user engagement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.3</span>
            <p className="mb-6">
              <b>Monetary Fine.</b> A monetary fine will be imposed based on the
              Credit-worth value of the affected Submissions. This fine will be
              calculated using a predefined formula that takes into account
              factors such as revenue generated from the Submissions, user
              engagement metrics, and any other relevant financial indicators.
              The fine will be deducted directly from the Curator's Credits on
              the Platform. Should the total fine exceed the available credits,
              the Curator’s account will reflect a negative balance, which may
              limit further activities on the Platform until resolved.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.4</span>
            <p className="mb-6">
              <b>Temporary Suspension.</b> If a breach is suspected or reported,
              the Curator's Account may be temporarily suspended while a
              thorough investigation is conducted by the Platform. During this
              period, the Curator will not have access to their account or its
              features. The duration of this suspension will depend on the
              complexity of the investigation but will be communicated to the
              Curator as soon as practicable.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.5</span>
            <p className="mb-6">
              <b>Permanent Suspension.</b> In cases where a breach is deemed
              severe—such as repeated violations, fraudulent activities, or
              actions that harm other users or the Platform—the Curator's
              Account may be permanently suspended. This action will be taken
              after careful consideration and will be accompanied by a formal
              notification outlining the reasons for such a decision.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.6</span>
            <p className="mb-6">
              <b>Freezing of Credits.</b> All Credits in the Curator's account
              may be frozen until a resolution regarding the breach is reached.
              This means that no transactions, including withdrawals or
              transfers, can occur during this period. The freezing of credits
              serves to protect both the Curator and the Platform while
              investigations are underway.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.7</span>
            <p className="mb-6">
              <b>Freezing of Payout Requests.</b> The Curator's right to request
              any payout from their Account will be suspended temporarily during
              the investigation and resolution process and permanently if they
              are found guilty. This measure ensures that any potential
              discrepancies related to breaches are addressed before any
              financial transactions are processed. The Platform reserves the
              right to enforce any combination of these penalties as deemed
              appropriate, based on an assessment of the nature and impact of
              each breach. The goal is to maintain a fair and trustworthy
              environment for all users while providing opportunities for
              learning and improving where possible. Notifications regarding any
              penalties imposed will be communicated to the Curator in writing,
              detailing the reasons for such actions and any available recourse
              they may have.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.8</span>
            <p className="mb-6">
              <b>Process for Suspension and Termination.</b> Upon identification
              of any violations in regard with this Agreement, the Platform will
              take immediate action to suspend the Curator's account pending an
              investigation as delineated in section 7 of this Agreement. The
              Curator will be notified of the suspension and provided with
              details regarding the grounds for action taken. Depending on the
              findings of the investigation, the Platform may either reinstate
              the account after appropriate review or proceed with permanent
              termination.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">7.9</span>
            <div>
              <p className="mb-6">
                <b>Platform Rights.</b> The Platform reserves the right to:
              </p>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">7.9.1</span>
                <div>
                  <p className="mb-6">
                    <b>Review Disputes.</b> The Platform shall have the
                    authority to review any disputes arising from the
                    acceptance, decline, placement, or removal of content
                    associated with Curator accounts. The Platform will conduct
                    a thorough investigation into such disputes and may request
                    additional information or documentation from the parties
                    involved to facilitate resolution.
                  </p>
                </div>
              </div>

              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">7.9.2</span>
                <div>
                  <p className="mb-6">
                    <b>Binding Action.</b> The Platform retains the exclusive
                    right to take final and binding action regarding the
                    standing of any account. This includes, but is not limited
                    to, decisions related to account suspensions, terminations,
                    or any other measures deemed necessary to uphold the
                    integrity of the Platform and its policies. The Curator
                    acknowledges that such decisions are at the sole discretion
                    of the Platform and are not subject to appeal.
                  </p>
                </div>
              </div>
              <div className="ml-8 gap-12 flex mb-8">
                <span className="inline-block">7.9.3</span>
                <div>
                  <p className="mb-6">
                    <b>Forfeiture of funds.</b> In the event that the Platform
                    conducts an investigation into any alleged violation of this
                    Agreement, the Platform reserves the right, at its sole
                    discretion, to forfeit any and all funds associated with the
                    Curator Account(s) that are found to be in violation or have
                    been previously suspended by the Platform. Such forfeiture
                    shall occur upon a determination by the Platform that the
                    Curator has engaged in conduct that constitutes a breach of
                    this Agreement or any applicable terms and conditions. The
                    Curator acknowledges and agrees that such forfeiture is a
                    permissible remedy in response to violations of this
                    Agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <b>8. Right to Appeal.</b> Curators whose accounts have been suspended
          or terminated will have the right to appeal the decision by submitting
          a written request to the Platform within 14 days of notification. The
          appeal must include a detailed explanation of the circumstances
          surrounding the alleged violation. The Platform will review all
          appeals on a case-by-case basis and provide a final decision within a
          reasonable timeframe.
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">9. Platform’s Right</p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">9.1</span>
            <p className="mb-6">
              <b>Verification of Curator Identity and Playlist Ownership.</b>{" "}
              The Platform reserves the right to conduct thorough verification
              processes to confirm the identity of all Curators, and the
              ownership of Playlists associated with their accounts. This
              verification may include, but is not limited to, the collection of
              personal identification documents, proof of affiliation for the
              proof of ownership itself, and any other relevant information
              deemed necessary by the Platform. Curators are required to
              cooperate fully with these verification requests and provide
              accurate and up-to-date information to facilitate this process.
              Failure to comply with verification requests may result in
              suspension or termination of the Curator’s account and associated
              playlists.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">9.2</span>
            <p className="mb-6">
              <b>Auditing of Follower Growth and Streaming Activity.</b> The
              Platform employs both third-party services and internal tools to
              monitor and audit the growth of followers and streaming activity
              on Playlists curated by Curators. This auditing process aims to
              ensure the authenticity and integrity of follower counts and
              streaming metrics. The Platform reserves the right to analyze data
              patterns, assess engagement levels, and investigate any suspicious
              activity that may indicate fraudulent practices, such as
              artificial inflation of follower counts or streaming numbers. In
              the event that irregularities are detected, the Platform may take
              appropriate action as mentioned in section 7 of this Agreement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">9.3</span>
            <p className="mb-6">
              <b>Requirement for Proof of Placement.</b> Curators may be
              required to provide documentation or proof of Placement upon
              request from the Platform. Such proof may include screenshots,
              links to external sites, or any other evidence that substantiates
              claims regarding Playlist Placements, follower engagement, or
              promotional activities. Curators must retain records of their
              Placements and be prepared to present this information promptly
              when requested. Failure to provide satisfactory proof of Placement
              within the specified timeframe may result in penalties as per
              section 7 of this Agreement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">9.4</span>
            <p className="mb-6">
              <b>Confidentiality of Information.</b> All information collected
              during the verification and auditing processes will be handled
              with strict confidentiality in accordance with applicable data
              protection laws. The Platform will not disclose any personal
              information or sensitive data without the Curator's consent,
              except as required by law or in response to a valid legal request.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">
            10. Platform Liability Disclaimer
          </p>

          <p className="mb-6">
            The Platform expressly disclaims any liability related to the
            following:
          </p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">10.1</span>
            <p className="mb-6">
              <b>Content Management.</b> The Platform shall not be liable for
              any content added to or removed from the Curator's playlists. The
              Curator assumes full responsibility for the selection, management,
              and curation of all content within their Playlists. This includes
              ensuring that all content adheres to applicable copyright laws and
              does not infringe upon the rights of third parties.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">10.2</span>
            <p className="mb-6">
              <b>Actions Taken by Third Party Platforms.</b> The Platform shall
              not be held liable for any actions taken by Third Party Platforms
              against the Curator’s account. This includes, but is not limited
              to, account suspensions, terminations, or any other punitive
              measures enforced by Third Party Platforms as a result of the
              Curator's actions or omissions. The Curator acknowledges that they
              are operating under the terms set forth by such Third-Party
              Platforms and accepts full responsibility for any consequences
              arising from their use of the Third-Party Platforms.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">10.3</span>
            <p className="mb-6">
              <b>Indemnification.</b> The Curator agrees to indemnify and hold
              harmless the Platform, its affiliates, officers, employees, and
              agents from any claims, losses, liabilities, damages, costs, or
              expenses (including reasonable attorneys' fees) arising out of or
              related to the Curator’s failure to comply with Third Party
              Platforms’ terms and conditions, monetization or promotional
              policies, or any other obligations set forth
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">10.4</span>
            <p className="mb-6">
              <b>Acknowledgment of Understanding.</b> By using the Platform and
              creating or managing playlists, the Curator acknowledges that they
              have read, understood, and agree to be bound by this section. The
              Curator further acknowledges that they have had the opportunity to
              seek independent legal advice regarding their responsibilities and
              liabilities as outlined herein.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">11. Governing Law; Jurisdiction</p>

          <p>
            This Agreement is to be construed and governed by the laws of the
            State of Delaware, USA, without regard to conflict of law
            provisions. The Parties irrevocably agree that any legal action or
            proceeding arising out of or in connection with this Agreement must
            exclusively be brought in any state or federal court located in
            Delaware, USA. The Parties agree not to assert, by way of motion, as
            a defense, or otherwise, in any such action, suit or proceeding, any
            claim that it is not subject personally to the jurisdiction of such
            court, that the action, suit or proceeding is brought in an
            inconvenient forum, that the venue of the action, suit or proceeding
            is improper or that this Agreement or the subject matter hereof may
            not be enforced in or by such court, and hereby agrees not to
            challenge such jurisdiction or venue by reason of any offsets or
            counterclaims in any such action, suit or proceeding.
          </p>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">12. General</p>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.1</span>
            <p className="mb-6">
              <b>Headings.</b> The headings in this Agreement are for
              convenience of reference only and shall not be deemed or construed
              to establish, define, or limit the meeting of any part, clause, or
              other provision herein.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.2</span>
            <p className="mb-6">
              <b>Compliance Assurance.</b> Curators acknowledge and agree that
              they are solely responsible for their compliance with all
              applicable terms and conditions of the Platform and any
              Third-Party Platform upon which the Curator operates their
              Playlists. The Platform disclaims any liability in relation to
              such compliance. In the event that a violation of the rules and
              regulations of any Third-Party Platform is discovered, the
              Platform reserves the right to suspend the Curator's account, in
              accordance with section 7 herein, to safeguard the interests of
              artists and to protect the reputation of the Platform. Any
              individual or entity that suspects violations of terms and
              conditions, concerns regarding Curators, Playlists, or any
              suspicious user activity is encouraged to report such matters for
              investigation. All inquiries should be directed to
              review@apolone.com.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.3</span>
            <p className="mb-6">
              <b>Notice.</b> All notices, requests, consents, claims, demands,
              waivers, and other communications under this Agreement (each, a
              “Notice”, and with the correlative meaning “Notify”) must be in
              writing and addressed to the other Party at its address herein
              mentioned (or to such other address that the receiving Party may
              designate from time to time in accordance with this clause).
              Unless otherwise agreed herein, all Notices must be delivered by
              personal delivery, nationally recognized overnight courier,
              certified or registered mail (in each case, return receipt
              requested, postage prepaid) or respective email addresses as
              provided by the Parties. Except as otherwise provided in this
              Agreement, a Notice is effective only (a) on receipt of the
              receiving Party; and (b) if the Party gives the Notice to the
              respective Party’s email address.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.4</span>
            <p className="mb-6">
              <b>Waiver of Jury Trial.</b> EACH OF THE PARTIES HERETO HEREBY
              WAIVES TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW ANY RIGHT
              TO A TRIAL BY JURY WITH RESPECT TO ANY COURT LITIGATION DIRECTLY
              OR INDIRECTLY ARISING OUT OF, UNDER, OR IN CONNECTION WITH THIS
              AGREEMENT OR THE SERVICES. EACH OF THE PARTIES FURTHER CERTIFIES
              THAT NO REPRESENTATIVE, AGENT OR ATTORNEY OF THE OTHER PARTY HAS
              REPRESENTED, EXPRESSLY OR OTHERWISE, THAT SUCH OTHER PARTY WOULD
              NOT, IN THE EVENT OF LITIGATION, SEEK TO ENFORCE THE FOREGOING
              WAIVER.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.5</span>
            <p className="mb-6">
              <b>Non-Disparagement.</b> Curator agrees and covenants not to, at
              any time, make, publish or communicate to any person or entity or
              in any public forum any defamatory or disparaging remarks,
              comments, or statements concerning, or with respect to, the
              Platform’s businesses or any of its employees or contractors. This
              Section does not, in any way, restrict or impede the Curator from
              exercising protected rights to the extent that such rights cannot
              be waived by agreement, or from complying with any applicable law
              or regulation or a valid order of a court of competent
              jurisdiction or a government agency.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.6</span>
            <p className="mb-6">
              <b>Force Majeure.</b> Neither party shall be liable for any
              failure to perform its obligations under this Agreement if such
              failure results from circumstances beyond its reasonable control,
              including but not limited to natural disasters (such as
              earthquakes, floods, hurricanes, or other acts of God), server
              outages, wars, terrorism, riots, labor disputes, pandemics,
              governmental actions, or any other events that could not have been
              reasonably foreseen or prevented (collectively referred to as
              "Force Majeure Events"). In the event of a Force Majeure Event,
              the affected party shall promptly notify the other party in
              writing of the occurrence of such an event and the expected
              duration of the delay. The performance of the affected obligations
              shall be suspended for the duration of the Force Majeure Event,
              and the time for performance shall be extended accordingly. The
              affected party shall not be held liable for any damages, losses,
              or expenses incurred by the other party as a result of such delay
              or non-performance due to a Force Majeure Event. Both parties
              agree to use reasonable efforts to mitigate the impact of the
              Force Majeure Event and resume performance as soon as reasonably
              practicable.
            </p>
          </div>

          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.7</span>
            <p className="mb-6">
              <b>Severability.</b> If a court of competent jurisdiction
              determines, for any reason, that any provision or requirement of
              this Agreement is invalid or unenforceable, such determination
              shall not invalidate or render unenforceable any other provision
              or requirements of this Agreement. In such an event, the
              provisions and requirements of this Agreement. In such an event,
              the provisions and requirements that are not the subject of the
              court’s determination shall be interpreted, to the extent
              permitted by law, in a manner that is consistent with the intent
              and purpose underlying the invalid or unenforceable provision or
              requirement. Likewise, if a court of competent jurisdiction
              determines, for any reason, that any provision or requirement of
              this Agreement is invalid or unenforceable as applied to a
              specific person or entity, such determination shall not affect the
              applicability of such provision or requirement to other persons or
              entities. In such an event, the provisions and requirements that
              are not the subject of the court’s determination shall be
              interpreted, to the extent permitted by law, in a manner that is
              consistent with intent and purpose underlying the inapplicable
              provision or requirement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.8</span>
            <p className="mb-6">
              <b>Waiver.</b> No waiver by any Party of any of the provisions of
              this Agreement shall be effective unless explicitly set forth in
              writing and signed by the Party so waiving. Except as otherwise
              set forth in this Agreement, no failure to exercise, or delay in
              exercising, any right, remedy, power, or privilege arising from
              this Agreement shall operate or be construed as a waiver thereof,
              not shall any single or partial exercise of any right, remedy,
              power, or privilege hereunder preclude any other or further
              exercise thereof or the exercise of other right, remedy, power, or
              privilege.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.9</span>
            <p className="mb-6">
              <b>Assignment</b> Either Party shall not assign, transfer,
              delegate, or subcontract any of its rights or delegate any of its
              obligations under this Agreement without the prior written consent
              of all Parties. Any purported assignment or delegation shall
              relieve the Party of any of its obligations under this Agreement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.10</span>
            <p className="mb-6">
              <b>No third-party beneficiary.</b> This Agreement benefits solely
              the Parties to this Agreement and their respective permitted
              successors and assigns and nothing in this Agreement, express or
              implied, confers on any other person any legal or equitable right,
              benefit, or remedy of any nature whatsoever under or by reason of
              this Agreement.
            </p>
          </div>
          <div className="ml-8 gap-12 flex mb-8">
            <span className="inline-block">12.11</span>
            <p className="mb-6">
              <b>Entire Agreement.</b> This Agreement, including and together
              with any related statement of work, exhibits, schedules,
              attachments, and appendices, constitutes the sole and entire
              agreement of the Parties with respect to the subject matter
              contained herein, and supersedes all prior and contemporaneous
              understandings, agreements, representations, warranties, both
              written and oral, regarding such subject matter.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-semibold mb-6">13. Acknowledgment</p>

          <p className="font-semibold">
            {" "}
            The Curator acknowledges that they have read and fully understood
            the entirety of this Agreement. By clicking "I Agree" or any similar
            button, the Curator affirms that they are entering into this
            Agreement with full consciousness and comprehension of its terms and
            conditions. The Curator further confirms that their consent is given
            voluntarily and without any coercion or undue influence.
          </p>
        </div>
      </div>
    </div>
  );
}
