// Adventures of Engine interactions - bulk of game content here

aoe.interactions = {};

aoe.interactions.person_chris = {
	"desk": function (interactor, other) {
		// Desk stuff
	},
	"person_mr_f": function (interactor, other) {
		MR_F.face_other_person(CHRIS);
		
		if (CHRIS.flags.is_wearing_tie_hat && !MR_F.flags.has_seen_tie_hat) {
			MR_F.says(["Nice hat."]);
			MR_F.flags.has_seen_tie_hat = true;
		}
		
		if (MR_F.screen_ref !== "e8" && !CHRIS.flags.is_worried_about_mr_f) {
			MR_F.says(["How did I get here?", "One minute I was by my desk..."]);
			MR_F.says(["...the next thing I know", "I'm here..."]);
			CHRIS.says(["Uh... I think you walked."]);
			MR_F.says(["But I don't remember..."]).and_then(() => {
				CHRIS.face_action("down");
				CHRIS.pause_action(200);
				CHRIS.any_function_action (() => {
					CHRIS.says(["I'm not sure he's okay..."]);
					CHRIS.flags.is_worried_about_mr_f = true;
				});				
			});
		}
		
		if (MR_F.screen_ref !== "e8" && CHRIS.flags.is_worried_about_mr_f) {
			CHRIS.says(["Maybe walking someone", "else's legs for them", "is unkind."]);
		}
		
		if (MR_F.screen_ref === "e8") {
			if (!CHRIS.flags.homework_conversation) {
				MR_F.says(["Chris! Where's your", "homework?"]);
				if (CHRIS.flags.has_renamed_kens_homework) {
					CHRIS.says(["Right here."]);
					MR_F.says(["..."]).and_then(() => {
						MR_F.pause_action(500);
						MR_F.any_function_action(() => {
							MR_F.says(["..."]);
							CHRIS.says(["..."]);
							MR_F.pause_action(1000);
							MR_F.any_function_action(() => {
								MR_F.says(["This is... incredible."]).and_then(() => {
									aoe.engine.stop_music();
									aoe.engine.play_audio("con_man_chris");
									aoe.engine.scrolling_image("conman_chris_text", 60000).and_then(() => {
										aoe.engine.end_game("con_man_chris");
									});
								});
							});
						});
					});
					return;
				}
				CHRIS.chooses([{line: "...be honest", result: "honesty"}, {line: "...lie", result: "lie"}, {line: "...stall for time", result: "stall"}, {line: "...", result: "silence"}]).and_then((choice) => {
					CHRIS.flags.homework_conversation = choice;
					if (choice === "honesty") {
						CHRIS.says(["I was going to do it but", "I feel asleep in the bath."]);
						MR_F.says(["On my desk tomorrow", "morning."]);
						CHRIS.says(["Yes sir..."]);
					} else if (choice === "lie") {
						CHRIS.says(["Dog ate it."]);
						MR_F.says(["You don't have a dog."]);
						CHRIS.says(["It went on fire."]);
						MR_F.says(["Really. And how did", "that happen?"]);
						CHRIS.says(["It was in chemistry. We", "were mixing..."]);
						CHRIS.chooses([{line: "...roentgenium and...", result: "roentgenium"}, {line: "...lithium and...", result: "lithium"}, {line: "...sodium chloride and...", result: "sodium chloride"}]).and_then((material_1) => {
							if (material_1 === "roentgenium") {
								MR_F.says(["There is no way you were", "working with roentgenium.", "You'd be dead. Are you dead?"]);
								CHRIS.says(["..."]);
								MR_F.says(["On my desk tomorrow", "morning Chris."]);
								CHRIS.flags.homework_conversation = "failed lie";
							} else {
								CHRIS.chooses([{line: "...oxygen", result: "oxygen"}, {line: "...krypton", result: "krypton"}, {line: "...osmium", result: "osmium"}]).and_then((material_2) => {
									if (material_2 === "krypton") {
										MR_F.says(["Krypton is inert. You", "need to research your", "excuses more thoroughly."]);
										CHRIS.says(["..."]);
										MR_F.says(["On my desk tomorrow", "morning Chris."]);
										CHRIS.flags.homework_conversation = "failed lie";									
									} else {
										if (material_1 === "lithium") {
											if (material_2 === "oxygen") {
												MR_F.says(["While I'm 100% sure your", "homework did not in fact", "go on fire, I'm actually..."]);
												MR_F.says(["...quite impressed at your", "knowledge of chemistry."]);
												CHRIS.says(["..."]);
												MR_F.says(["On my desk tomorrow", "morning."]);
												CHRIS.flags.homework_conversation = "successful lie";
											}
											if (material_2 === "osmium") {
												MR_F.says(["Can't say I've heard of", "osmium..."]);
												CHRIS.says(["It goes on fire."]);
												MR_F.says(["I'm not buying it Chris.", "Homework on my desk", "tomorrow morning."]);
												CHRIS.flags.homework_conversation = "failed lie";												
											}
										}
										if (material_1 === "sodium chloride") {
											MR_F.says(["So you're telling me you", "made salty " + material_2, "and it went on fire?"]);
											CHRIS.says(["..."]);
											MR_F.says(["On my desk tomorrow", "morning Chris."]);
											CHRIS.flags.homework_conversation = "failed lie";											
										}
									}
								});
							}
						});
					} else if (choice === "stall") {
						CHRIS.says(["Uh... just give me", "a minute..."]);
						MR_F.says(["Mmmmhmmm..."]);
					} else if (choice === "silence") {
						MR_F.says(["Chris?"]);
						CHRIS.says(["..."]);
						MR_F.says(["Use your words Chris."]);
						CHRIS.chooses([{line: "...just tell him", result: "honesty"}, {line: "...run away", result: "run"}]).and_then((choice2) => {
							if (choice2 === "honesty") {
								CHRIS.says(["Okay so I fell asleep in the",  "bath..."]);
								MR_F.says(["Again?"]);
								CHRIS.says(["..."]);
								MR_F.says(["This has got to stop Chris.", "On my desk tomorrow morning."]);
								CHRIS.flags.homework_conversation = "honesty";
							}
							if (choice2 === "run") {
								CHRIS.flags.homework_conversation = "run";
								MR_F.watch_chris_speed = 100;
								let down_distance = 10 - CHRIS.grid_y;
								let right_distance = 14 - CHRIS.grid_x; 
													
								if (right_distance > 0) { CHRIS.run_action("right", right_distance); }
								CHRIS.run_action("down", down_distance);
								CHRIS.face_action("r");
								CHRIS.pause_action(200);
								CHRIS.interact_with_action(E8_TO_HUT_ENTRANCE_DOOR);	
								CHRIS.pause_action(1000);
								CHRIS.any_function_action( () => {
									VICKI.face_other_person(CHRIS);
									VICKI.says(["Ummm... everything okay?"]);
									CHRIS.chooses([{line: "...yeah", result: "yes"}, {line: "...", result: "silence"}]).and_then((chris_said_something) => {
										if	(chris_said_something === "yes") {
											// Nuffin
										} else if (chris_said_something === "silence") {
											VICKI.says(["Chris?"]);
											CHRIS.chooses([{line: "...yeah", result: "no running"}, {line: "...keep running", result: "more running"}]).and_then((chris_runs) => {
												if (chris_runs === "more running") {
													CHRIS.run_action("right", 3);
													CHRIS.run_action("down", 2);
													CHRIS.any_function_action( () => {
														aoe.engine.set_music("feral_beast");
														aoe.engine.scrolling_image("feral_chris_ending", 40000).and_then(() => {
															aoe.engine.end_game("feral_chris");
														});
													});
												} else if (chris_runs === "no running") {
													VICKI.says(["You're weird."]);
												}
											});
										}
									});
								});
							}
						});
					}
				});
			} else {
				if (CHRIS.flags.homework_conversation === "failed lie") {
					MR_F.says(["Get out of here with your", "tall tales Chris."]);
				}
				if (CHRIS.flags.homework_conversation === "successful lie") {
					MR_F.says(["I wish you put as", "much effort into English", "as you do Chemistry."]);
				}
				if (CHRIS.flags.homework_conversation === "failed hand-in") {
					MR_F.says(["I worry about you Chris.", "I worry about your life."]);
				}
				if (CHRIS.flags.homework_conversation === "weak hand-in") {
					MR_F.says(["At least you tried."]);
				}
				if (CHRIS.flags.homework_conversation === "honesty") {
					MR_F.says(["Have you not got a", "home to go to Chris?"]);
				}
				if (CHRIS.flags.homework_conversation === "stall") {
					MR_F.says(["Okay, where is it?"]);
					if (CHRIS.flags.has_renamed_kens_homework) {
						CHRIS.says(["Right here."]);
						MR_F.says(["..."]).and_then(() => {
							MR_F.pause_action(500);
							MR_F.any_function_action(() => {
								MR_F.says(["..."]);
								CHRIS.says(["..."]);
								MR_F.pause_action(1000);
								MR_F.any_function_action(() => {
									MR_F.says(["This is... incredible."]).and_then(() => {
										aoe.engine.stop_music();
										aoe.engine.play_audio("con_man_chris");
										aoe.engine.scrolling_image("conman_chris_text", 60000).and_then(() => {
											aoe.engine.end_game("con_man_chris");
										});
									});
								});
							});
						});						
					} else {
						if (!CHRIS.flags.attempted_homework) {
							CHRIS.chooses([{line: "...fess up", result: "fess"}, {line: "...lie", result: "lie"}, {line: "...", result: "silence"}]).and_then((choice) => {
								if (choice === "fess") {
									CHRIS.says(["...I didn't do it."]);
									MR_F.says(["You don't say. On my", "desk tomorrow morning."]);
									CHRIS.flags.homework_conversation = "honesty";
								}
								if (choice === "lie") {
									CHRIS.says(["Dog ate it."]);
									MR_F.says(["So you needed a minute to", "remember that your non-", "existent dog ate it?"]);
									CHRIS.says(["..."]);
									MR_F.says(["That's the best you can", "come up with?"]);
									CHRIS.says(["..."]);
									MR_F.says(["On my desk. Tomorrow", "morning."]);
									CHRIS.flags.homework_conversation = "failed lie";
								}
								if (choice === "silence") {
									MR_F.says(["Nothing to say huh?"]);
									CHRIS.says(["..."]);
									MR_F.says(["Just... whatever. Bring", "me it tomorrow."]);
									CHRIS.flags.home_work_conversation = "honesty";
								}
							});
						}
						if (CHRIS.flags.attempted_homework === "without knowledge") {
							CHRIS.says(["Here."]);
							MR_F.says(["..."]).and_then(() => {
								MR_F.pause_action(500);
								MR_F.any_function_action(() => {
									MR_F.says(["..."]);
									CHRIS.says(["..."]);
									MR_F.says(["0/10. F-"]);
									CHRIS.says(["But I handed it in right?"]);
									MR_F.says(["Just go Chris."]);
									CHRIS.flags.homework_conversation = "failed hand-in";
								});
							});
						}
						if (CHRIS.flags.attempted_homework === "with knowledge") {
							CHRIS.says(["Here."]);
							MR_F.says(["..."]).and_then(() => {
								MR_F.pause_action(500);
								MR_F.any_function_action(() => {
									MR_F.says(["Hmmm... it's a bit", "rubbish but..."]);
									MR_F.says(["It's at least technically", "'homework' I suppose."]);
									CHRIS.says(["..."]);
									MR_F.says(["I'll give you a E-."]).and_then(() => {
										CHRIS.face_action("down");
										CHRIS.pause_action(200);
										CHRIS.any_function_action(() => {
											CHRIS.says(["New record."]);
											CHRIS.flags.homework_conversation = "weak hand-in";
										});
									});
								});
							});						
						}
					}
				}
				if (CHRIS.flags.homework_conversation === "run") {
					MR_F.says(["The heck was that", "all about?"]);
				}
			}
		}
	},
	"person_vicki": function (interactor, other) {
		VICKI.face_other_person(CHRIS);
		let attempt_interaction_text = "...attempt interaction";
		
		if (!CHRIS.flags.vicki_interaction_attempts) {
			CHRIS.flags.vicki_interaction_attempts = {};
		}		
		
		if (CHRIS.flags.is_wearing_tie_hat && !VICKI.flags.has_seen_tie_hat) {
			VICKI.says(["Nice hat."]);
			VICKI.flags.has_seen_tie_hat = true;
		} else {
			VICKI.says(["Oh hi Chris."]);
		}
		
		if (CHRIS.flags.has_completed_french_exam && !VICKI.flags.knows_french_exam_result) {
			VICKI.says(["How did the French test go?"]);
			if (CHRIS.flags.french_exam_result === "failed-tried") {
				CHRIS.says(["I said some French words but", "they weren't the right ones."]);
				VICKI.says(["At least you tried..."]);
			}
			if (CHRIS.flags.french_exam_result === "failed-gave-up") {
				CHRIS.says(["Failed. Couldn't be bothered."]);
				VICKI.says(["Oh."]);
			}
			if (CHRIS.flags.french_exam_result === "failed-book") {
				CHRIS.says(["I took a text book in", "with me..."]);
				VICKI.says(["Right..."]);
				CHRIS.says(["...and tried reading an", "answer out from it."]);
				VICKI.says(["...what?"]);
				CHRIS.says(["I don't know why I", "thought it was a good idea."]);
			}
			if (CHRIS.flags.french_exam_result === "ran away") {
				CHRIS.says(["Um... I left the room", "before it started."]);
				VICKI.says(["Oh... I guess you failed."]);
				CHRIS.says(["I think so."]);
			}
			if (CHRIS.flags.french_exam_result === "failed-unplugged") {
				CHRIS.says(["I unplugged the tape", "recorder..."]);
				VICKI.says(["Chris!!"]);
				CHRIS.says(["Think I'm in trouble..."]);
				VICKI.says(["No kidding."]);
			}
			VICKI.flags.knows_french_exam_result = true;
			attempt_interaction_text = "...attempt further interaction";
		}

		CHRIS.chooses([{line: attempt_interaction_text, result: "interact"}, {line: "...", result: "silence"}]).and_then((choice) => {
			if (choice === "interact") {
				let possible_choices = [];
				
				if (!CHRIS.flags.vicki_interaction_attempts.hi) {
					possible_choices.push({line: "...try to say hi", result: "hi"});
				}
				
				if (CHRIS.flags.onion === "taken" && !CHRIS.flags.vicki_interaction_attempts.onion) {
					possible_choices.push({line: "...show her your onion", result: "onion"});
				}
				
				if (CHRIS.flags.has_french_book && !CHRIS.flags.vicki_interaction_attempts.french_book) {
					possible_choices.push({line: "...recite French poetry", result: "french_book"});
				}
				
				if (CHRIS.flags.attempted_homework) {
					possible_choices.push({line: "...talk about homework", result: "homework"});
				}
				
				if (CHRIS.flags.is_wearing_tie_hat) {
					possible_choices.push({line: "...offer her the tie hat", result: "tie hat"});
				}
				
				if (possible_choices.length === 0) {
					CHRIS.face_action("d");
					CHRIS.pause_action(200);
					CHRIS.any_function_action(() => {
						CHRIS.says(["What am I supposed to", "say though?"]);
					});
				} else {
					CHRIS.chooses(possible_choices).and_then((choice2) => {
						if (choice2 === "hi") {
							CHRIS.says(["..."]);
							VICKI.says(["..."]);						
							CHRIS.says(["...hi."]);
							VICKI.says(["Hi."]).and_then(() => {
								CHRIS.face_action("d");
								CHRIS.pause_action(200);
								CHRIS.any_function_action(() => {
									CHRIS.says(["This is too hard."]);
								});
							});
						}
						if (choice2 === "onion") {
							CHRIS.says(["..."]);
							VICKI.says(["..."]);						
							CHRIS.says(["...I've an onion."]);
							VICKI.says(["..."]).and_then(() => {
								CHRIS.face_action("d");
								CHRIS.pause_action(200);
								CHRIS.any_function_action(() => {
									CHRIS.says(["That didn't go down well."]);
								});
							});								
						}
						if (choice2 === "french_book") {
							CHRIS.face_action("down");
							CHRIS.any_function_action(() => {
								CHRIS.ignore_idle = true;
								if (CHRIS.has_made_tie_hat) {
									CHRIS.img = aoe.images.chris_d_with_book_no_tie;
								} else {
									CHRIS.img = aoe.images.chris_d_with_book;
								}
								CHRIS.says(["La morve, la morve..."]);
								CHRIS.says(["Le sirop sale de la tete..."]);
								CHRIS.says(["Il eclate encore une", "fois de la narine..."]);
								CHRIS.says(["Petits morceaux avec elle..."]);
								CHRIS.says(["Peau seche congelee..."]);
								CHRIS.says(["C'est comme du fromage", "cottage vert..."]);
								CHRIS.says(["Sur ton visage..."])
								CHRIS.says(["Partout sur votre", "visage degoutant."]).and_then(() => {
									CHRIS.pause_action(200);
									CHRIS.face_action("up");
									CHRIS.any_function_action(() => {
										CHRIS.ignore_idle = false;
										CHRIS.says(["..."]);
										VICKI.says(["...wow. That was pretty."]).and_then(() => {
											CHRIS.face_action("d");
											CHRIS.pause_action(200);
											CHRIS.any_function_action(() => {
												CHRIS.says(["I think she liked it!"]);
											});											
										});
									});										
								});							
							});
						}
						if (choice2 === "homework") {
							CHRIS.says(["..."]);
							VICKI.says(["..."]);						
							CHRIS.says(["...I've done my homework."]);
							VICKI.says(["Right."]).and_then(() => {
								CHRIS.face_action("d");
								CHRIS.pause_action(200);
								CHRIS.any_function_action(() => {
									CHRIS.says(["She's not interested in", "my homework..."]);
								});
							});									
						}
						if (choice2 === "tie hat") {
							CHRIS.says(["Do you want my tie hat?"]);
							VICKI.says(["Aw that's sweet of you!", "Are you sure?"]);
							CHRIS.says(["Yeah."]).and_then(() => {
								CHRIS.additional_images = [];
								CHRIS.pause_action(500);
								CHRIS.flags.is_wearing_tie_hat = false;
								CHRIS.any_function_action(() => {
									VICKI.add_additional_image("tie_hat", 4, -6);
									CHRIS.pause_action(200);
									CHRIS.any_function_action(() => {
										VICKI.flags.is_wearing_tie_hat = true;										
										CHRIS.says(["Suits you."]);
										VICKI.says(["Thanks!"]).and_then(() => {
											CHRIS.pause_action(200);
											CHRIS.any_function_action(() => {
												VICKI.says(["I'm going home now. You", "coming with me?"]);
												CHRIS.chooses([{line: "...yes", result: "yes"}, {line: "...no", result: "no"}]).and_then((going) => {
													if (going === "yes") {
														VICKI.says(["Come on then..."]).and_then(() => {
															CHRIS.accepting_input = false;
															if (CHRIS.flags.has_completed_french_exam) {														
																if (CHRIS.is_below(VICKI)) {
																	VICKI.walk_action("left", 1);
																	VICKI.walk_action("down", 1);
																	VICKI.any_function_action(() => {
																		VICKI.walk_action("down", 6);
																		CHRIS.walk_action("down", 6);
																		CHRIS.any_function_action(() => {
																			CHRIS.remove_from_game();
																			VICKI.remove_from_game();
																		});
																		CHRIS.pause_action(1000);
																			aoe.engine.stop_music();
																			aoe.engine.play_audio("victory");
																		CHRIS.any_function_action(() => {
																			aoe.engine.image_box("chris_is_happy").and_then(() => {
																				aoe.engine.end_game("tie_walk");
																			});
																		});
																	});
																} else if (CHRIS.is_to_the_right_of(VICKI)) {
																	VICKI.walk_action("left");
																	CHRIS.pause_action(1);
																	CHRIS.walk_action("left");
																	CHRIS.any_function_action(() => {
																		VICKI.walk_action("down", 7);
																		CHRIS.walk_action("down", 7);
																		CHRIS.any_function_action(() => {
																			CHRIS.remove_from_game();
																			VICKI.remove_from_game();
																		});
																		CHRIS.pause_action(1000);
																		CHRIS.any_function_action(() => {
																			aoe.engine.stop_music();
																			aoe.engine.play_audio("victory");
																			aoe.engine.image_box("chris_is_happy").and_then(() => {
																				aoe.engine.end_game("tie_walk");
																			});
																		});
																	});
																} else if (CHRIS.is_to_the_left_of(VICKI)) {
																	VICKI.walk_action("down", 7);
																	CHRIS.walk_action("down", 7);
																	CHRIS.any_function_action(() => {
																		CHRIS.remove_from_game();
																		VICKI.remove_from_game();
																	});
																	CHRIS.pause_action(1000);
																	CHRIS.any_function_action(() => {
																		aoe.engine.stop_music();
																		aoe.engine.play_audio("victory");
																		aoe.engine.image_box("chris_is_happy").and_then(() => {
																			aoe.engine.end_game("tie_walk");
																		});
																	});																
																}
															}
															if (!CHRIS.flags.has_completed_french_exam) {
																VICKI.pause_action(100);
																VICKI.walk_action("down", 2);
																CHRIS.walk_action("down", 2);
																CHRIS.any_function_action(() => {
																	MRS_J.face("up");
																	MRS_J.move_to(5, 7, "hut_entrance")
																	MRS_J.says(["Chris!"]);
																	CHRIS.says(["Uh-oh..."]);
																	MRS_J.says(["I hope you're not thinking", "of going home..."]);
																	VICKI.says(["Oh... bye Chris..."]).and_then(() => {
																		CHRIS.animate_action("chris_d_collapsing_no_tie", "person_collapsing");
																		CHRIS.any_function_action(() => {
																			CHRIS.animation = aoe.animations.person_weeping;
																			CHRIS.img = aoe.images.chris_d_weeping_no_tie;
																			CHRIS.current_frame = 0;
																			CHRIS.ignore_idle = true;
																			CHRIS.pause_action(4000);
																			CHRIS.any_function_action(() => {
																				if (MR_F && (!CHRIS.flags.homework_conversation || CHRIS.flags.homework_conversation === "leave" || CHRIS.flags.homework_conversation === "run" || CHRIS.flags.homework_conversation === "stall")) {
																					if (MR_F.screen_ref === "e8") {
																						MR_F.face("right");
																						MR_F.move_to(1, 6, "hut_entrance");
																						MR_F.says(["About your homework..."]).and_then(() => {
																							aoe.engine.end_game("failed_tie_walk");	
																						});
																					} else if (MR_F.screen_ref === "n2") {
																						MR_F.face("left");
																						MR_F.move_to(8, 6, "hut_entrance");
																						MR_F.says(["About your homework..."]).and_then(() => {
																							aoe.engine.end_game("failed_tie_walk");	
																						});	
																					} else {
																						aoe.engine.end_game("failed_tie_walk");
																					}
																				} else {
																					aoe.engine.end_game("failed_tie_walk");
																				}
																			});
																		});
																		VICKI.walk_action("left", 1);
																		VICKI.walk_action("down", 4);
																		VICKI.any_function_action(() => {
																			VICKI.remove_from_game();
																		});
																	});
																});
															}
														});
													}
													if (going === "no") {
														CHRIS.flags.didnt_walk_home_with_vicki = true;
														VICKI.says(["Bye then."]).and_then(() => {
															if (CHRIS.is_below(VICKI)) {
																VICKI.walk_action("left", 1);
																VICKI.walk_action("down", 6);
																VICKI.any_function_action(() => {
																	VICKI.remove_from_game();
																});
															} else {
																VICKI.walk_action("down", 6);
																VICKI.any_function_action(() => {
																	VICKI.remove_from_game();
																});
															}
														});
													}
												});
											});
										});
									});
								});
							});
						}
						CHRIS.flags.vicki_interaction_attempts[choice2] = true;
					});
				}
			} 
			if (choice === "silence") {
				// Nuffin
			}
		});
	},
	"person_sam": function (interactor, other) {
		if (CHRIS.flags.is_wearing_tie_hat && !SAM.flags.has_seen_tie_hat) {
			SAM.says(["Nice hat."]);
			SAM.flags.has_seen_tie_hat = true;
		}
		
		let possible_choices = [];
		
		if (CHRIS.flags.homework_conversation === "stall" && !CHRIS.flags.knows_what_homework_is) {
			possible_choices.push({line: "...ask about homework", result: "homework"});
		}
		
		if (CHRIS.flags.is_existentially_disturbed && !CHRIS.flags.embraced_existence) {
			possible_choices.push({line: "...ask about outside", result: "existence"});
		}
		
		if (CHRIS.flags.embraced_existence && !CHRIS.flags.has_asked_sam_about_fun) {
			possible_choices.push({line: "...ask about fun", result: "fun"});
		}
		
		if (CHRIS.flags.onion === "taken" && !CHRIS.flags.has_asked_sam_about_onion) {
			possible_choices.push({line: "...ask about the onion", result: "onion"});
		}
		
		if (CHRIS.flags.is_worried_about_mr_f && !CHRIS.flags.has_asked_sam_about_mr_f) {
			possible_choices.push({line: "...ask about Mr F", result: "mr f"});
		}
		
		if (possible_choices.length > 0) {
			possible_choices.push({line: "...", result: "silence"});
			CHRIS.chooses(possible_choices).and_then((choice) => {
				if (choice === "onion") {
					CHRIS.says(["I found an onion in", "a coat."]);
					SAM.says(["Oh yeah..."]);
					CHRIS.says(["Why would there be", "an onion?"]);
					SAM.says(["It's a lame bit of randomness", "from your second adventure."]);
					CHRIS.says(["My what?"]);
					SAM.says(["Never mind."]);
					CHRIS.flags.has_asked_sam_about_onion = true;
				}
				if (choice === "homework") {
					CHRIS.says(["What homework were we", "meant to do?"]);
					SAM.says(["An essay on the quasi-maternal", "role of Juliette's nurse."]);
					CHRIS.flags.knows_what_homework_is = true;
					CHRIS.chooses([{line: "...ask if you can copy it", result: "copy"}, {line: "...", result: "silence"}]).and_then((choice2) => {
						if (choice2 === "copy") {
							CHRIS.says(["...can I copy yours?"]);
							SAM.says(["Too late - it's on Mr. F's desk."]);
						}
						if (choice2 === "silence") {
							CHRIS.pause_action(200);
							CHRIS.any_function_action(() => {
								SAM.says(["You didn't do it did you?"]);
								CHRIS.says(["No..."]);
							});
						}
					});
				}
				if (choice === "existence") {
					CHRIS.says(["I was looking out the window", "just now and it's a bit..."]);
					SAM.says(["..."]);
					CHRIS.says(["...unrealistic."]);
					SAM.says(["Uh-oh..."]);
					CHRIS.says(["What?"]);
					SAM.says(["Well now that you've", "noticed..."]);
					CHRIS.says(["What?"]);
					SAM.says(["Um... you're in a game."]);
					CHRIS.says(["What?"]);
					SAM.says(["This is a game. You're in", "somebody's " + aoe.browser + " window", "right now."]);
						if (aoe.browser === "browser") {
							SAM.says(["And whatever browser this", "person uses is old or obscure."]);
						} else if (aoe.browser === "Chrome") {
							CHRIS.says(["What's 'Chrome'?"]);
							SAM.says(["A browser. The best browser?"]);
						} else if (aoe.browser === "Firefox") {
							CHRIS.says(["What's 'Firefox'?"]);
							SAM.says(["A browser. Used to be for", "cool kids."]);						
						} else if (aoe.browser === "Safari") {
							CHRIS.says(["What's 'Safari'?"]);							
							SAM.says(["Netscape of the future.", "But for Apple hipsters."]);							
						} else if (aoe.browser === "IE") {
							SAM.says(["And IE stopped being good", "a long long time ago."]);
						} else if (aoe.browser === "Opera") {
							CHRIS.says(["I can't hear any singing..."]);
							SAM.says(["Opera is a browser no one uses.", "Apart from whoever is playing."]);
						} else if (aoe.browser === "Edge") {
							CHRIS.says(["Isn't he in U2?"]);
							SAM.says(["Edge is nu IE, but really", "Chrome with a special hat on."]);
							CHRIS.says(["What's 'Chrome'?"]);
							SAM.says(["Ehhh... never mind."]);
						}
					CHRIS.says(["...is this all just Flash?"]);
					SAM.says(["No one uses Flash any", "more Chris."]);
					CHRIS.says(["Since when!?"]);
					SAM.says(["So you think it's 1999 right?"]);
					CHRIS.says(["Last time I checked..."]);
					SAM.says(["It's 2019. You're in a", "20th anniversary remake."]);
					CHRIS.says(["..."]);
					SAM.says(["Flash is unacceptable", "in my time."]);
					CHRIS.says(["What!? What are you", "talking about?"]);
					SAM.says(["Look, I'll just prove", "that this is code okay?"]).and_then(() => {
						let i = 0;
						CHRIS.pause_action(200);
						CHRIS.run_action("up", 4);
						CHRIS.face_action("down");
						CHRIS.any_function_action(() => {
							CHRIS.says(["I'M A WEENY HEAD"]);
						});
						CHRIS.pause_action(500);
						CHRIS.any_function_action(() => {aoe.engine.texts_to_display = []});
						CHRIS.pause_action(200);
						for (i = 0; i < 5; i += 1) {
							CHRIS.face_action("l");
							CHRIS.face_action("u");
							CHRIS.face_action("r");
							CHRIS.face_action("d");
						}
						CHRIS.pause_action(200);
						CHRIS.run_action("down", 4);
						CHRIS.any_function_action(() => {
							CHRIS.says(["Aaagh what was that!?"]);
							SAM.says(["Hahahaha"]);
							CHRIS.says(["You're a terrible person."]);
							SAM.says(["Yeah. Well anyway, now that", "you know, what are you", "going to do?"]);
							CHRIS.chooses([{line: "...embrace this new existence", result: "embrace"}, {line: "...freak out", result: "freak"}]).and_then((choice2) => {
								if (choice2 === "embrace") {
									CHRIS.flags.embraced_existence = true;
									CHRIS.says(["So... we could do pretty much", "anything?"]);
									SAM.says(["Within reason."]);
									CHRIS.says(["Could we make things a", "bit more fun?"]);
									SAM.says(["Yes! Why didn't I think of this?", "Give me a second..."]).and_then(() => {
										CHRIS.pause_action(500);
										CHRIS.any_function_action(() => {
											aoe.engine.screens.e8.background_image = aoe.images.e8_fun_bg;
											aoe.engine.set_music("fun");
										});
										CHRIS.any_function_action(() => {
											SAM.says(["There! This is fun right?"]);
											CHRIS.says(["Um..."]);
											CHRIS.any_function_action(() => {
												SAM.says(["Did I overdo it?"]);
												CHRIS.says(["..."]);
												SAM.says(["Sorry, I'm not very good at", "fun."]);												
											});
										});
									});
								} else {
									CHRIS.says(["You're a sociopath! Why", "would you do this to me?"]);
									SAM.says(["Hey..."]);
									CHRIS.says(["It's cruel! I'm stuck in", "classrooms forever!"]);
									SAM.says(["..."])
									CHRIS.says(["Your game sucks."]);
									SAM.says(["FINE. You don't like", "my game. Fine."]);
									SAM.says(["I spent a lot of time", "on this you know."]);
									SAM.says(["I made loads of cool", "happy things to do..."]);
									SAM.says(["But you don't like the game.", "Fine. I'll delete it then."]);
									SAM.says(["Hey Mr F!"]).and_then(() => {
										MR_F.face_action("d");
										CHRIS.any_function_action(() => {
											MR_F.says(["Huh?"]).and_then(() => {
												CHRIS.pause_action(500);
												CHRIS.any_function_action(() => {
													MR_F.animate_action("mr_f_vapourise", "person_being_vapourised");
												});
												CHRIS.pause_action(500);												
												CHRIS.any_function_action(() => {
													MR_F.remove_from_game();
													CHRIS.says(["You... vapourised him..."]);
													SAM.says(["I'm not prepared to stand", "here listening to this."]).and_then(() => {
														aoe.engine.screens.e8.background_image = aoe.images.void_bg;
														CHRIS.says(["What..."]).and_then(() => {
															CHRIS.pause_action(500);
															CHRIS.any_function_action(() => {
																aoe.engine.screens.e8.all_vertical_desks.forEach((desk) => {
																	CHRIS.any_function_action(() => {
																	desk.img = aoe.images.desk_v_vapourise;
																	desk.animation = aoe.animations.desk_being_vapourised;
																	});
																});
																CHRIS.pause_action(500);
																CHRIS.any_function_action(() => {
																	aoe.engine.screens.e8.all_right_chairs.forEach((chair) => {
																		CHRIS.any_function_action(() => {
																		chair.img = aoe.images.chair_r_red_vapourise;
																		chair.animation = aoe.animations.chair_being_vapourised;
																		});
																	});
																	CHRIS.pause_action(1000);
																	CHRIS.any_function_action(() => {
																		aoe.engine.screens.e8.mr_f_chair.img = aoe.images.chair_l_teal_vapourise;
																		aoe.engine.screens.e8.mr_f_chair.animation = aoe.animations.chair_being_vapourised;
																		SAM.says(["Goodbye Chris."]).and_then(() => {
																			aoe.engine.stop_all_audio();
																			SAM.pause_action(200);
																			SAM.animate_action("sam_vapourise", "person_being_vapourised");
																			SAM.any_function_action(() => {
																				aoe.engine.obs.forEach((ob) => {
																					if (ob !== CHRIS) {
																						ob.remove_from_game();
																					}
																				});																				
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								}
							});
						});
					});
				}
				if (choice === "fun") {
					CHRIS.flags.has_asked_sam_about_fun = true;
					CHRIS.says(["The fun is messing with my", "eyesight."]);
					SAM.says(["Sorry, it's a bit too", "much isn't it?"]);
					CHRIS.says(["Well..."]);
					SAM.says(["I'll change it back..."]).and_then(() => {
						CHRIS.pause_action(500);
						CHRIS.any_function_action(() => {aoe.engine.screens.e8.background_image = aoe.images.e8_bg; aoe.engine.set_music("huts");});
						CHRIS.pause_action(200);
						CHRIS.any_function_action(() => {
							SAM.says(["There."]);
							CHRIS.says(["Thanks."]);
							SAM.says(["Tell you what, how about", "I let you take control..."]);
							SAM.says(["...of Mr. F for a while?", "Is that fun?"]);
							CHRIS.says(["Yeah that's more like it."]);
							SAM.says(["Okay. Do you know the", "controls?"]);
							CHRIS.says(["Uh... I use the legs to", "walk?"]);
							SAM.says(["Perfect. There'll be a Mr F", "docking station in N2 when", "you're done."]);
							SAM.says(["Off you go then!"]).and_then(() => {
								CHRIS.is_player_controlled = false;
								MR_F.is_player_controlled = true;
								MR_F.accepting_input = true;
								MR_F_DOCKING_STATION_N2.show();
							});
						});					
					});
				}
				if (choice === "mr f") {
					CHRIS.flags.has_asked_sam_about_mr_f = true;
					CHRIS.says(["I'm a bit worried about", "Mr F..."]);
					CHRIS.says(["He doesn't seem right since", "I docked him in N2"]);
					SAM.says(["He'll get over it."]);
					CHRIS.says(["I dunno... he's kinda", "staring into space..."]);
					SAM.says(["Okay, if you're worried, how", "about you walk him back here?"]);
					CHRIS.chooses([{line: "...walk him back over", result: "walk him"}, {line: "...don't", result: "no walkies"}]).and_then((walk_mr_f) => {
						if (walk_mr_f === "walk him") {
							CHRIS.says(["Okay. Maybe it'll help."]);
							SAM.says(["He's all yours..."]).and_then(() => {
								aoe.engine.set_screen("n2");
								CHRIS.is_player_controlled = false;
								MR_F.is_player_controlled = true;
								MR_F.accepting_input = true;
								MR_F_DOCKING_STATION_E8.show();								
							});
						} else if (walk_mr_f === "no walkies") {
							CHRIS.says(["Ehh... I think I did enough", "damage already."]);
						}
					});
				}
				if (choice === "silence") {
					SAM.says(["..."]);
				}
			});
		} else if (!CHRIS.flags.is_wearing_tie_hat || SAM.flags.has_seen_tie_hat) {
			SAM.says(["..."]);
		}
	},
	"person_mrs_j": function (interactor, other) {
		MRS_J.face_other_person(CHRIS);
		
		if (CHRIS.flags.is_wearing_tie_hat && !MRS_J.flags.has_seen_tie_hat) {
			MRS_J.says(["Beau chapeau."]);
			MRS_J.flags.has_seen_tie_hat = true;
		}
		
		const start_recording = function () {
			MRS_J_DESK.img = aoe.images.desk_v_mrs_j_recording;
			MRS_J_DESK.animation = aoe.animations.tape_recorder;
		};
		
		const stop_recording = function () {
			MRS_J_DESK.img = aoe.images.desk_v_mrs_j;
			MRS_J_DESK.animation = false;
		};
		
		const mock_oral = function () {
			start_recording();
			MRS_J.says(["Que penses-tu de l'ecole?"]);
			let options = [];
			options.push({line: "...attempt French", result: "attempt"});
			if (CHRIS.flags.has_french_book) {
				options.push({line: "...look in the book", result: "book"});
			}
			options.push({line: "...", result: "silence"});
			CHRIS.chooses(options).and_then((answer_1) => {
				if (answer_1 === "attempt") {
					if (CHRIS.flags.has_revised) {
						CHRIS.says(["Je pense que c'est tout", "a fait terrible."]);
						MRS_J.says(["Oh vraiment?"]);
						CHRIS.says(["Oui. C'est une souffrance", "sans fin."]);
						MRS_J.says(["Mais pas les cours", "de francais non?"]);
						CHRIS.says(["..."]);
						MRS_J.says(["Parlez-moi de votre", "passe-temps favori..."]);
						CHRIS.chooses([{line: "...attempt french", result: "attempt"}, {line: "...give up", result: "give up"}]).and_then((answer_2) => {
							if (answer_2 === "give up") {
								CHRIS.says(["..."]);
								MRS_J.says(["PARLEZ-MOI. DE. VOTRE.", "PASSE-TEMPS FAVOURI???"]);
								CHRIS.says(["..."]);
								MRS_J.says(["You're supposed to", "say something Chris."]);
								CHRIS.says(["..."]);
								MRS_J.says(["You know what? Forget", "it. You've failed."]);
								MRS_J.says(["And you were showing", "such promise..."]).and_then(() => {
									stop_recording();
									CHRIS.says(["...so I can go home?"]);
									MRS_J.says(["Yes, get out of here."]);
									CHRIS.flags.has_completed_french_exam = true;
									CHRIS.flags.french_exam_result = "failed-gave-up";		
									MR_F.remove_from_game();
									SAM.remove_from_game();									
								});
							}
							if (answer_2 === "attempt") {
								if (CHRIS.flags.has_revised) {
									CHRIS.says(["J'aime m'asseoir dans mes", "sous-vetements en", "jouant a Tekken."]);
									MRS_J.says(["Oh ... c'est quoi Tekken?"]);
									CHRIS.says(["Un jeu de combat japonais."]);
									MRS_J.says(["Votre francais est incroyable!"]);
									CHRIS.says(["Oui, j'ai lu un livre bleu", "pendant quelques minutes."]);
									MRS_J.says(["Je vois..."]);
									MRS_J.says(["Dis-moi, qu'est-ce que", "tu preferes en France?"]);
									CHRIS.says(["Sans aucun doute c'est.."]).and_then(() => {
										CHRIS.pause_action(500);
										CHRIS.any_function_action(() => {
											CHRIS.says(["...la liberte, l'egalite",  "et la fraternite"]).and_then(() => {
												MRS_J.pause_action(500);
												MRS_J.any_function_action(() => {
													MRS_J.says(["Hou la la! Si belle!"]);
													CHRIS.says(["..."]);
													MRS_J.says(["You're getting an A++"]);
													CHRIS.says(["...really?"]);
													MRS_J.says(["Yes! You speak better French", "than most French people."]);
													aoe.engine.scrolling_image("president_of_france", 40000).and_then(() => {
														aoe.engine.end_game("president_of_france");
													});
												});
											});
										});
									});
								} else {
									CHRIS.says(french_gibberish()).and_then(() => {
										MRS_J.pause_action(500);
										MRS_J.any_function_action(() => {
											MRS_J.says(["Comment t'appelle tu?"]);
											CHRIS.says(["..."]);
											MRS_J.says(["..."]);
											CHRIS.says(["...Chris?"]);
											MRS_J.says(["Finally. Well at least", "you tried."]);
											MRS_J.says(["You can go now."]).and_then(stop_recording);
											CHRIS.flags.has_completed_french_exam = true;
											CHRIS.flags.french_exam_result = "failed-tried";		
											MR_F.remove_from_game();
											SAM.remove_from_game();		
										});
									});
								}
							}							
						});						
					} else {
						CHRIS.says(french_gibberish());
						MRS_J.says(["...ah oui... uh..."]);
						MRS_J.says(["Parlez-moi de votre", "passe-temps favori..."]);
						CHRIS.chooses([{line: "...attempt french", result: "attempt"}, {line: "...give up", result: "give up"}]).and_then((answer_2) => {
							if (answer_2 === "give up") {
								CHRIS.says(["..."]);
								MRS_J.says(["PARLEZ-MOI. DE. VOTRE.", "PASSE-TEMPS FAVOURI???"]);
								CHRIS.says(["..."]);
								MRS_J.says(["You're supposed to", "say something Chris."]);
								CHRIS.says(["..."]);
								MRS_J.says(["You know what? Forget", "it. You've failed miserably."]).and_then(() => {
									stop_recording();
									CHRIS.says(["...so I can go home?"]);
									MRS_J.says(["Yes, get out of here."]);
									CHRIS.flags.has_completed_french_exam = true;
									CHRIS.flags.french_exam_result = "failed-gave-up";		
									MR_F.remove_from_game();
									SAM.remove_from_game();
								});					
							}
							if (answer_2 === "attempt") {
								if (CHRIS.flags.has_revised) {
									CHRIS.says(["J'aime m'asseoir dans mes", "sous-vetements en jouant a Tekken."]);
									MRS_J.says(["Oh ... c'est quoi Tekken?"]);
									CHRIS.says(["Un jeu de combat japonais."]);
									MRS_J.says(["Votre francais est incroyable"]);
									CHRIS.says(["Oui, j'ai lu un livre bleu", "pendant quelques minutes."]);
									MRS_J.says(["Je vois..."]);
									MRS_J.says(["Dis-moi, qu'est-ce que", "tu preferes en France?"]);
									CHRIS.says(["Sans aucun doute c'est.."]).and_then(() => {
										CHRIS.pause_action(500);
										CHRIS.any_function_action(() => {
											CHRIS.says(["...la liberte, l'egalite",  "et la fraternite"]).and_then(() => {
												MRS_J.pause_action(500);
												MRS_J.any_function_action(() => {
													MRS_J.says(["Hou la la! Si belle!"]);
													CHRIS.says(["..."]);
													MRS_J.says(["You're getting an A++"]);
													CHRIS.says(["...really?"]);
													MRS_J.says(["Yes! You speak better French", "than most French people."]);
													aoe.engine.scrolling_image("president_of_france", 40000).and_then(() => {
														aoe.engine.end_game("president_of_france");
													});
												});
											});
										});
									});
								} else {
									CHRIS.says(french_gibberish()).and_then(() => {
										MRS_J.pause_action(500);
										MRS_J.any_function_action(() => {
											MRS_J.says(["Comment t'appelle tu?"]);
											CHRIS.says(["..."]);
											MRS_J.says(["..."]);
											CHRIS.says(["...Chris?"]);
											MRS_J.says(["Finally. Well at least", "you tried."]).and_then(() => {
												stop_recording();
												MRS_J.says(["You can go now."]);
												CHRIS.flags.has_completed_french_exam = true;
												CHRIS.flags.french_exam_result = "failed-tried";														
												MR_F.remove_from_game();
												SAM.remove_from_game();
											});
										});
									});
								}
							}							
						});
					}
				}
				if (answer_1 === "silence") {
					MRS_J.says(["...que penses-tu...", "...de l'ecole...?"]);
					CHRIS.chooses([{line: "...attempt french", result: "attempt"}, {line: "...give up", result: "give up"}]).and_then((answer_1_2) => {
						if (answer_1_2 === "attempt") {
							if (CHRIS.flags.has_revised) {
								CHRIS.says(["Je pense que c'est tout", "a fait terrible."]);
								MRS_J.says(["Oh vraiment?"]);
								CHRIS.says(["Oui. C'est une souffrance", "sans fin."]);		
								MRS_J.says(["Mais pas les cours", "de francais non?"]);
								CHRIS.says(["..."]);
								
							} else {
								CHRIS.says(french_gibberish());
								MRS_J.says(["...ah oui... uh..."]);
								MRS_J.says(["Parlez-moi de votre", "passe-temps favori..."]);
								CHRIS.chooses([{line: "...attempt french", result: "attempt"}, {line: "...give up", result: "give up"}]).and_then((answer_2) => {
									if (answer_2 === "give up") {
										CHRIS.says(["..."]);
										MRS_J.says(["PARLEZ-MOI. DE. VOTRE.", "PASSE-TEMPS FAVOURI???"]);
										CHRIS.says(["..."]);
										MRS_J.says(["You're supposed to", "say something Chris."]);
										CHRIS.says(["..."]);
										MRS_J.says(["You know what? Forget", "it. You've failed miserably."]).and_then(() => {
											stop_recording();
											CHRIS.says(["...so I can go home?"]);
											MRS_J.says(["Yes, get out of here."]);
											CHRIS.flags.has_completed_french_exam = true;
											CHRIS.flags.french_exam_result = "failed-gave-up";										
											MR_F.remove_from_game();
											SAM.remove_from_game();
										});
									}
									if (answer_2 === "attempt") {
										if (CHRIS.flags.has_revised) {
											CHRIS.says(["J'aime m'asseoir dans mes sous-", "vetements en jouant a Tekken."]);
											MRS_J.says(["Oh ... c'est quoi Tekken?"]);
											CHRIS.says(["Un jeu de combat japonais."]);
											MRS_J.says(["Votre francais est incroyable"]);
											CHRIS.says(["Oui, j'ai lu un livre", "bleu pendant quelques minutes."]);
											MRS_J.says(["Je vois..."]);
											MRS_J.says(["Dis-moi, qu'est-ce que", "tu préfères en France?"]);
											CHRIS.says(["Sans aucun doute c'est.."]).and_then(() => {
												CHRIS.pause_action(500);
												CHRIS.any_function_action(() => {
													CHRIS.says(["...la liberte, l'egalite",  "et la fraternite."]).and_then(() => {
														MRS_J.pause_action(500);
														MRS_J.any_function_action(() => {
															MRS_J.says(["Hou la la! Si belle!"]);
															CHRIS.says(["..."]);
															MRS_J.says(["You're getting an A++"]);
															CHRIS.says(["...really?"]);
															MRS_J.says(["Oh yes! You speak better", "French than most French people."]);
															aoe.engine.scrolling_image("president_of_france", 40000).and_then(() => {
																aoe.engine.end_game("president_of_france");
															});
														});
													});
												});
											});
										} else {
											CHRIS.says(french_gibberish()).and_then(() => {
												MRS_J.pause_action(500);
												MRS_J.any_function_action(() => {
													MRS_J.says(["Comment t'appelle tu?"]);
													CHRIS.says(["..."]);
													MRS_J.says(["..."]);
													CHRIS.says(["...Chris?"]);
													MRS_J.says(["Finally. Well at least", "you tried."]).and_then(() => {
														stop_recording();
														MRS_J.says(["You can go now."]);
														CHRIS.flags.has_completed_french_exam = true;
														CHRIS.flags.french_exam_result = "failed-tried";	
														MR_F.remove_from_game();
														SAM.remove_from_game();															
													});
												});
											});
										}
									}
								});
							}
						}
						if (answer_1_2 === "give up") {
							CHRIS.says(["..."]);
							MRS_J.says(["QUE PENSES-TU DE", "L'ECOLE CHRIS??"]);
							CHRIS.says(["...dunno."]);
							MRS_J.says(["This is pathetic. You're", "literally the worst student."]).and_then(() => {
								stop_recording();
								MRS_J.says(["You've failed Chris.", "Failed harder than anyone."]);
								CHRIS.says(["..."]);
								MRS_J.says(["Just go."])
								CHRIS.flags.has_completed_french_exam = true;
								CHRIS.flags.french_exam_result = "failed-gave-up";
								MR_F.remove_from_game();
								SAM.remove_from_game();
							});
						}
					});
				}
				if (answer_1 === "book") {
					CHRIS.any_function_action(() => {CHRIS.img = CHRIS.images.d_with_book});
					CHRIS.pause_action(1000);
					CHRIS.any_function_action(() => {
						MRS_J.says(["...Chris?"]).and_then(() => {
							CHRIS.pause_action(500);
							CHRIS.any_function_action(() => {
								CHRIS.face("up");
								CHRIS.says(["J'aime aller nager le jeudi"]).and_then(() => {
									CHRIS.pause_action(500);
									CHRIS.any_function_action(() => {
										MRS_J.says(["You just read that from", "a text book."]);
										CHRIS.says(["..."]);
										MRS_J.says(["You didn't even read out", "the right answer."]);
										CHRIS.says(["..."]).and_then(() => {
											stop_recording();
											MRS_J.says(["Failed. Give me the book", "and get out of here."]);
											CHRIS.flags.has_completed_french_exam = true;
											CHRIS.flags.has_french_book = false;
											CHRIS.flags.french_exam_result = "failed-book";
										});
									});
								});
							});
						});
					})
				}
			});
		};
		
		if (CHRIS.flags.has_completed_french_exam) {
			if (CHRIS.flags.french_exam_result === "failed-book") {
				MRS_J.says(["Rentrez chez vous et", "repensez votre vie."]);
			}
			if (CHRIS.flags.french_exam_result === "failed-gave-up") {
				MRS_J.says(["Casse-toi!"]);
			}
			if (CHRIS.flags.french_exam_result === "failed-tried") {
				MRS_J.says(["Go home and revise. If", "you can't describe your"]);
				MRS_J.says(["hobby in French you'll", "amount to nothing."]);				
			}
			if (CHRIS.flags.french_exam_result === "failed-unplugged") {
				MRS_J.says(["Aller se faire cuire un oeuf!"]);
			}
		}
		
		if (!CHRIS.flags.has_completed_french_exam && CHRIS.flags.has_spoken_to_mrs_j) {
			MRS_J.says(["It is time for French."]).and_then(() => {
				mock_oral();
			});
		}
		
		if (!CHRIS.flags.has_completed_french_exam && !CHRIS.flags.has_spoken_to_mrs_j) {
			CHRIS.flags.has_spoken_to_mrs_j = true;
			if (CHRIS.flags.has_revised) {
				MRS_J.says(["What time do you call this?"]);
				CHRIS.says(["..."]);
				MRS_J.says(["I was about to pack up,", "fail you, and go home."]);
				CHRIS.says(["..."]);
				MRS_J.says(["Well I hope you talk more", "French than you do English."]);
			} else {
				MRS_J.says(["Let's talk some", "French shall we?"]);
				CHRIS.says(["..."]);
			}
			MRS_J.says(["Tell me when you're ready and", "I'll start the tape"]);
			CHRIS.chooses([{line: "...ready", result: "ready"}, {line: "...not ready", result: "not ready"}]).and_then((readiness) => {
				if (readiness === "ready") {
					mock_oral();
				}
				if (readiness === "not ready") {
					MRS_J.says(["Okay, take a couple of", "seconds to compose yourself."]);
					MRS_J.says(["French should not be spoken", "during periods of distress."]);
				}
			});
		}
		
	},
	"door": function (interactor, other) {
		if (!other.is_locked || (other === E8_TO_HUT_ENTRANCE_DOOR && CHRIS.flags.needs_to_escape)) {
			if ((interactor.screen_ref === "e8_store_room" && other.destination_screen_ref === "n2_store_room") || (interactor.screen_ref === "n2_store_room" && other.destination_screen_ref === "e8_store_room")) {
				if (CHRIS.flags.passage_is_open) {
					CHRIS.flags.needs_to_escape = false;
					CHRIS.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
					aoe.engine.set_screen(other.destination_screen_ref);					
				} else {
					CHRIS.says(["This bit of wall looks odd."]);
				}
			} else if (other === E8_TO_HUT_ENTRANCE_DOOR && CHRIS.flags.needs_to_escape) {
				if (!CHRIS.flags.door_kick_count) {
					CHRIS.flags.door_kick_count = 0;
				}

				let choices = [];
				
				if (CHRIS.flags.has_tried_reasoning_with_door && !CHRIS.flags.tried_door_after_reasoning) {
					CHRIS.flags.tried_door_after_reasoning = true;
					CHRIS.says(["Well that didn't work..."]);
				}
				
				if (CHRIS.flags.door_kick_count === 0) {
					choices.push({line: "...try to kick the door down", result: "kick"});
				}
				if (CHRIS.flags.door_kick_count > 0 && CHRIS.flags.door_kick_count < 3) {
					choices.push({line: "...kick the door again", result: "kick"});
				}
				if (!CHRIS.flags.has_tried_lockpicking) {
					choices.push({line: "...try to pick the lock", result: "pick"});
				}
				if (!CHRIS.flags.has_tried_reasoning_with_door) {
					choices.push({line: "...try reasoning with the door", result: "reason"});
				}
				
				if (choices.length > 0) {
					choices.push({line: "...", result: "nothing"});
				} else {
					CHRIS.says(["I'm out of ideas."]);
					return;
				}
				
				CHRIS.chooses(choices).and_then((choice) => {
					if (choice === "kick") {
						CHRIS.flags.door_kick_count += 1;
						if (CHRIS.flags.has_made_tie_hat) {
							CHRIS.animate_action("chris_r_kicking_no_tie", "person_blinking");
							aoe.engine.play_audio("kick_noise");							
						} else {
							aoe.engine.play_audio("kick_noise");
							CHRIS.animate_action("chris_r_kicking", "person_blinking");
						}
						if (CHRIS.flags.door_kick_count < 3) {
							CHRIS.pause_action(500);							
						}
						CHRIS.any_function_action(() => {
							if (CHRIS.flags.door_kick_count === 1) {
								CHRIS.says(["Didn't work."]);
							} else if (CHRIS.flags.door_kick_count === 2) {
								CHRIS.says(["Still not working."]);
							} else {
								CHRIS.says(["Ow my foot!"]).and_then(() => {
									CHRIS.face_action("down");
									CHRIS.pause_action(500);
									CHRIS.any_function_action(() => {
										CHRIS.says(["This isn't working."]);
									});
								});
							}
						})
					}
					if (choice === "pick") {
						CHRIS.says(["..."]).and_then(() => {
							CHRIS.pause_action(200);
							CHRIS.any_function_action(() => {
								CHRIS.face_action("down");
								CHRIS.says(["Don't know how to pick a lock."]);
								CHRIS.flags.has_tried_lockpicking = true;				
							});						
						});
					}
					if (choice === "reason") {
						CHRIS.flags.has_tried_reasoning_with_door = true;
						CHRIS.chooses([{line: "...ask nicely", result: "nice"}, {line: "...make demands", result: "tough"}, {line: "...grovel", result: "pathetic"}]).and_then((attitude) => {
							if (attitude === "nice") {
								CHRIS.says(["Mr. Doorfriend, would you be", "so kind as to be not locked?"]);
							}
							if (attitude === "tough") {
								CHRIS.says(["Listen here stupid rectangle,", "you betta rotate pronto or I'll"]);
								CHRIS.says(["saw you into bits and mail", "you to the technology block."]);
							}
							if (attitude === "pathetic") {
								CHRIS.says(["Please open, I'm just", "a wretched child..."]);
							}
						});
					}
				});
			} else if (interactor.screen_ref === "e8_store_room" && other.destination_screen_ref === "e8" && CHRIS.flags.has_revised && !CHRIS.flags.knows_everyone_has_left) {
				CHRIS.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
				aoe.engine.set_screen(other.destination_screen_ref);
				CHRIS.pause_action(500);
				CHRIS.any_function_action(() => {
					aoe.engine.interaction_just_started = false; // Bit hacky
					CHRIS.flags.knows_everyone_has_left = true;
					CHRIS.says(["Oh. Everyone went home."]).and_then(() => {
						CHRIS.pause_action(200);
						CHRIS.run_action("down", 8);
						CHRIS.face_action("r");
						CHRIS.pause_action(200);						
						CHRIS.any_function_action(() => {
							CHRIS.says(["The door is locked... how", "do I get out of here?"]);
							CHRIS.flags.needs_to_escape = true;
						});
					});
				});
			} else if (interactor.screen_ref === "e8_store_room" && other.destination_screen_ref && MR_F && !MR_F.flags.is_suspicious && MR_F.screen_ref === "e8") {
				CHRIS.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
				aoe.engine.set_screen(other.destination_screen_ref);
				MR_F.flags.is_suspicious = true;
				MR_F.watch_chris_speed = 2000;
				MR_F.says(["Hey! What are you up to?"]);
				CHRIS.chooses([{line: "...make something up", result: "make up"}, {line: "...", result: "silence"}]).and_then((choice) => {
					if (choice === "make up") {
						CHRIS.says(["...uh... I thought this", "was the way out."]);
						MR_F.says(["Sure you did. Keep out of", "there."]);
					}
					if (choice === "silence") {
						MR_F.says(["No good I guess. Keep out", "of there."]);
					}
				});
			} else if (other.is_door_to_e8 && CHRIS.flags.has_completed_french_exam) {
				CHRIS.says(["Locked. Everyone must have", "gone home."]);
				if (CHRIS.flags.has_renamed_kens_homework) {
					CHRIS.says(["I guess renaming Ken's", "homework was a waste of time..."]);
				};
			} else if (other === E8_TO_HUT_ENTRANCE_DOOR && MR_F.screen_ref === "e8" && !CHRIS.flags.homework_conversation) {
				MR_F.face_action("down");
				MR_F.says(["Chris! Where do you", "think you're going?"]).and_then(() => {
					CHRIS.face_action("up");
					CHRIS.says(["..."]);
					MR_F.says(["Where's your homework?"]);
					CHRIS.chooses([{line: "...stall for time", result: "stall"}, {line: "...leave anyway", result: "leave"}]).and_then((choice) => {
						if (choice === "stall") {
							CHRIS.flags.homework_conversation = "stall";
							CHRIS.says(["Uh... give me a minute"]);
							MR_F.says(["Mmmhmm..."]);
						}
						if (choice === "leave") {
							CHRIS.face_action("right");
							CHRIS.pause_action(100);
							CHRIS.any_function_action(() => {
								CHRIS.flags.homework_conversation = "leave";
								CHRIS.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
								aoe.engine.set_screen(other.destination_screen_ref);
							});
						}
					});
				});
			} else if (other.is_door_to_e8 && (CHRIS.flags.homework_conversation === "run" || CHRIS.flags.homework_conversation === "leave")) {
				CHRIS.says(["No way am I going back", "in there."]);
			} else if (other.is_door_to_e8_store_room && MR_F.screen_ref === "e8" && (MR_F.facing === "u" || MR_F.facing === "r")) {
				MR_F.says(["Get out of there!"]);
			} else {
				CHRIS.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
				aoe.engine.set_screen(other.destination_screen_ref);
			}
		} else {
			CHRIS.says(["Locked."]);
		}
	},
	"e8_window": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			if (CHRIS.flags.embraced_existence) {
				CHRIS.says(["No point trying to escape into", "nothing is there?"]);
			} else if (CHRIS.screen_ref === "e8" && aoe.engine.screens.e8.background_image === aoe.images.e8_fun_bg) {
				CHRIS.says(["No hope of escape here. Don't", "want to depressurise the classroom."]);
			} else {
				let choices = [];
				if (!CHRIS.flags.has_tried_opening_window) {
					choices.push({line: "...see if it opens", result: "open"});
				}
				if (!CHRIS.flags.has_tried_breaking_window) {
					choices.push({line: "...try breaking it", result: "break"});
				}
				choices.push({line: "...", result: "nothing"});
				if (choices.length === 0) {
					CHRIS.says(["It's no use..."])
				} else {
					CHRIS.chooses(choices).and_then((choice) => {
						if (choice === "open") {
							if (!CHRIS.flags.has_tried_breaking_window) {
								CHRIS.says(["Nope, no way to open it."]);
							} else {
								CHRIS.says(["Can't open it either. This", "is hopeless."]);
							}
							CHRIS.flags.has_tried_opening_window = true;
						}
						if (choice === "break") {
							if (!CHRIS.flags.has_tried_opening_window) {
								CHRIS.says(["Ugh... it's double glazed. No", "chance."]);
							} else {
								CHRIS.says(["Nope, can't break it either.", "This is hopeless."]);
							}
						}
					});
				}
			}
			return;
		}
		
		if (!interactor.flags.window_interactions) {
			interactor.flags.window_interactions = 0;
		}
		
		if (!CHRIS.flags.embraced_existence) {
			let w = interactor.flags.window_interactions;
			
			if (w === 0) {
				CHRIS.says(["Nice day out."]);
			} else if (w === 1) {
				CHRIS.says(["Bushes, sky, chainlink", "fence..."]);
			} else if (w === 2) {
				CHRIS.says(["You know something doesn't", "look right out there..."]);
			} else if (w === 3) {
				CHRIS.says(["Were those bushes always", "this pixelated?"]);
			} else if (w === 4) {
				CHRIS.says(["Why is there nothing beyond", "the fence?"]);
			} else if (w === 5) {
				CHRIS.says(["It's like there's no world", "outside. Just... blue."]);
				CHRIS.flags.is_existentially_disturbed = true;
			} else {
				CHRIS.says(["Looking out of the window is", "disturbing."]);
			}
			
			interactor.flags.window_interactions += 1;
		}
		
		if (CHRIS.flags.embraced_existence) {
			if (CHRIS.screen_ref === "e8" && aoe.engine.screens.e8.background_image === aoe.images.e8_fun_bg) {
				CHRIS.says(["I guess this is better", "than a fence..."]);
			} else {
				CHRIS.says(["I'm done with windows."]);
			}
		}
		
	},
	"e8_boards_bottom": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			if (CHRIS.flags.has_read_gotd) {
				CHRIS.says(["Can't see any way to escape", "via terrible year 9 fiction."])
			} else {
				CHRIS.says(["Someone's story... I'm too", "busy escaping to read it."]);
			}
		} else {
			let lines1, choices;
			if (CHRIS.flags.has_read_gotd) {
				lines1 = ["This is total rubbish."];
				choices = [{line: "...read it again anyway", result: "read"}, {line: "...leave it", result: "no-read"}];
			} else {
				lines1 = ["Print out of someone's", "creative writing assignment..."];
				choices = [{line: "...read it", result: "read"}, {line: "...leave it", result: "no-read"}];			
			}
			CHRIS.says(lines1);
			CHRIS.chooses(choices).and_then((choice) => {
				if (choice === "read") {
					aoe.engine.image_box("gotd_1");
					aoe.engine.image_box("gotd_2");
					aoe.engine.image_box("gotd_3");
					aoe.engine.image_box("gotd_4");
					aoe.engine.image_box("gotd_5");
					CHRIS.flags.has_read_gotd = true;
				} else {
					// Nuffin
				}
			});
		}
	},
	"e8_boards_middle": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["Can't waste my time with", "these now. I'm trapped!"]);
		} else {
			CHRIS.says(["A bunch of adverts from", "newspapers. We did 'writing", "to persuade' last term..."]);
			CHRIS.chooses([{line: "...take a look", result: "look"}, {line: "...don't", result: "no-look"}]).and_then((choice) => {
				if (choice === "look") {
					aoe.engine.image_box("advert_board");
				} else {
					// Nuffin
				}
			});
		}
	},
	"e8_boards_top": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			if (!CHRIS.flags.knows_about_secret_switch) {
				CHRIS.says(["How is a blank board", "going t... hang on..."]);
				CHRIS.says(["There's a mysterious and", "convenient switch under it..."]);
			}
			CHRIS.chooses([{line: "...flip the switch", result: "flip"}, {line: "...don't", result: "don't"}]).and_then((choice) => {
				if (choice === "flip") {
					aoe.engine.play_audio("click_noise");
					if (!CHRIS.flags.passage_is_open) {
						CHRIS.flags.passage_is_open = true;
						aoe.engine.screens.e8_store_room.background_image = aoe.images.e8_store_room_bg_passage_open;
						aoe.engine.screens.n2_store_room.background_image = aoe.images.n2_store_room_bg_passage_open;
					} else {
						CHRIS.flags.passage_is_open = false;
						aoe.engine.screens.e8_store_room.background_image = aoe.images.e8_store_room_bg;
						aoe.engine.screens.n2_store_room.background_image = aoe.images.n2_store_room_bg;						
					}
					if (!CHRIS.flags.knows_about_secret_switch) {
						CHRIS.says(["Wonder what that did..."]);
					}
					CHRIS.flags.knows_about_secret_switch = true;
				} else {
					if (!CHRIS.flags.knows_about_secret_switch) {
						CHRIS.says(["Yes, why would I do that?", "Why, when I'm trapped in"]);
						CHRIS.says(["a classroom, and have", "found a mysterious switch"]);
						CHRIS.says(["why would I then try to", "push it?"]);
					}
				}
			});
		} else {
			CHRIS.says(["Nothing on this one..."]);
		}
	},
	"e8_poster": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["No escape route behind", "the poster. And I didn't bring", "my rock hammer."]);
		} else {
			CHRIS.says(["A poster with a picture", "of a sinister looking man..."]);
			CHRIS.says(['"No more Mr. Nice Guy"']);
		}
	},
	"e8_blackboard": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["Hmm... doesn't seem to be", "anything escapeful here."]);
		} else {
			if (aoe.engine.screens.e8.background_image === aoe.images.e8_fun_bg) {
				aoe.engine.image_box("e8_blackboard_fun");
			} else {
				aoe.engine.image_box("e8_blackboard");
			}
		}
	},
	"e8_thermos": function (interactor, other) {
		if (CHRIS.flags.has_revised) {
			CHRIS.says(["No way Mr F would leave", "The Thermos sitting here."]);
		} else {
			if (!CHRIS.flags.has_poked_thermos) {
				CHRIS.says(["Mr F always has this..."]);
				if (MR_F.screen_ref === "e8") {
					MR_F.face("down");
					MR_F.says(["Don't. Touch. The Thermos."]);
				} else {
					CHRIS.chooses([{line: "...poke it", result: "poke"}, {line: "...leave it be", result: "leave"}]).and_then((choice => {
						if (choice === "poke") {
							MR_F_DESK.img = aoe.images.thermos_near_miss;
							MR_F_DESK.animation = aoe.animations.thermos_near_miss;
							aoe.engine.play_audio("thermos_near_miss");
							CHRIS.pause_action(1950);
							CHRIS.any_function_action(() => {
								MR_F_DESK.animation = false;
								MR_F_DESK.img = aoe.images.desk_v_mr_f;
								CHRIS.says(["I don't like it."]);
								CHRIS.flags.has_poked_thermos = true;
							});
						}
					}));
				}
			} else {
				CHRIS.says(["Not touching that again."]);
			}
		}
	},
	"e8_homework_pile": function (interactor, other) {
		if (CHRIS.flags.has_revised) {
			CHRIS.says(["Looks like Mr F took the", "pile of homework..."]);
		} else {
			CHRIS.says(["A pile of handed-in homework."]);
			if (!CHRIS.flags.has_looked_through_homework_pile) {
				CHRIS.chooses([{line: "...look through it", result: "look"}, {line: "...don't", result: "don't"}]).and_then((choice) => {
					if (choice === "look") {
						if (MR_F.screen_ref === "e8") {
							MR_F.face("left");
							MR_F.says(["Get off that!"]);
						} else {
							CHRIS.flags.has_looked_through_homework_pile = true;
							CHRIS.says(["Let's see... hmmm..."]);
							CHRIS.says(["Here it is! Ken's homework."]);
							if (!CHRIS.flags.homework_conversation || CHRIS.flags.homework_conversation === "stall") {
								CHRIS.chooses([{line: "...take it", result: "take"}, {line: "...don't", result: "leave"}]).and_then((choice2) => {
									if (choice2 === "take") {
										CHRIS.says(["Boom! All I need to", "do is change the name!"]);
										CHRIS.flags.has_kens_homework = true;
									} else if (choice2 === "leave") {
										CHRIS.says(["No, that would be wrong.", "...wouldn't it?"]);
									}
								});
							} else {
								CHRIS.flags.has_looked_through_homework_pile = true;
								if (CHRIS.flags.homework_conversation.indexOf("lie") > -1) {
									CHRIS.says(["Shame I already tried", "to blag it."]);
								} else {
									CHRIS.says(["This would have been really", "useful earlier..."])
								}
							}
						}
					}
				});
			} else if (CHRIS.flags.has_looked_through_homework_pile) {
				if (CHRIS.flags.has_kens_homework) {
					CHRIS.says(["Not going to find anything", "superior to Ken's homework."]);
				} else if (!CHRIS.flags.has_kens_homework) {
					if (!CHRIS.flags.homework_conversation || CHRIS.flags.homework_conversation === "stall") {
						CHRIS.chooses([{line: "...take Ken's homework", result: "take"}, {line: "...don't", result: "leave"}]).and_then((choice) => {
							if (choice === "take") {
								CHRIS.says(["The temptation is just too", "much to bear."]);
								CHRIS.says(["All I need to do is change", "the name."]);
								CHRIS.flags.has_kens_homework = true;
							} else if (choice === "leave") {
								CHRIS.says(["No, come on, that's not", "a nice thing to do..."]);
							}
						});
					} else {
						CHRIS.says(["It's no use to me now."]);
					}
				}
			}
		}
	},
	"e8_store_room_box": function (interactor, other) {
		if (CHRIS.needs_to_escape) {
			CHRIS.says(["Can't tipex my way to freedom..."]);
		} else {
		CHRIS.says(["Staples, Tipex, highlighters..."]);
			if (CHRIS.flags.has_kens_homework) {
				CHRIS.says(["Wait a second... Tipex!"]);
				CHRIS.chooses([{line: "...white out Ken's name", result: "white out"}, {line: "...don't", result: "don't"}]).and_then((decision) => {
					if (decision === "white out") {
						CHRIS.says(["Looking good..."]);
						if (CHRIS.flags.has_pen) {
							CHRIS.says(["...I'll just write in", "my name..."]);
							CHRIS.says(["...and now it's mine."]);
							CHRIS.flags.has_renamed_kens_homework = true;
						} else {
							CHRIS.says(["...I need a pen though."]);
							CHRIS.flags.needs_a_pen_for_kens_homework = true;
						}
					}
					if (decision === "don't") {
						CHRIS.says(["I can't do that to Ken. We", "go back years..."]);
					}
				});
			}
		}
	},
	"e8_store_room_paper": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["How is paper going to help", "the me-being-trapped situation?"]);
		} else {
			CHRIS.says(["A stack of blank paper"]);
			if (CHRIS.flags.homework_conversation === "stall" && CHRIS.flags.has_pen && !CHRIS.flags.has_kens_homework && !CHRIS.flags.attempted_homework) {
				CHRIS.says(["I guess I could try to", "do my homework..."]);
				CHRIS.chooses([{line: "...attempt homework", result: "attempt"}, {line: "...don't", result: "no attempt"}]).and_then((attempt) => {
					if (CHRIS.flags.knows_what_homework_is) {
						if (attempt === "attempt") {
							CHRIS.says(["Right... Juliette's nurse..."]).and_then(() => {
								CHRIS.img = aoe.images.chris_u_fiddling;
								CHRIS.animation = aoe.animations.person_walking;
								CHRIS.ignore_idle = true;
								CHRIS.pause_action(2000);
								CHRIS.any_function_action(() => {
									CHRIS.ignore_idle = false;
									CHRIS.face("down");
									CHRIS.says(["Ehh.. it'll have to do."]);									
									aoe.engine.image_box("homework_bad");
									CHRIS.flags.attempted_homework = "with knowledge";
								});								
							});
						}
						if (attempt === "no attempt") {
							CHRIS.says(["Maybe this is a bad idea."]);
						}
					} else {
						if (attempt === "attempt") {
							CHRIS.says(["Hmm... don't actually know", "what the homework is..."]);
							CHRIS.chooses([{line: "...wing it", result: "wing it"}, {line: "...don't", result: "no winging it"}]).and_then((wing_it) => {
								if (wing_it === "wing it") {
									CHRIS.says(["It's probably about", "Romeo and Juliette..."]).and_then(() => {
										CHRIS.img = aoe.images.chris_u_fiddling;
										CHRIS.animation = aoe.animations.person_walking;
										CHRIS.ignore_idle = true;
										CHRIS.pause_action(2000);
										CHRIS.any_function_action(() => {
											CHRIS.ignore_idle = false;
											CHRIS.face("down");
											CHRIS.says(["Better than nothing."]);											
											aoe.engine.image_box("homework_rubbish");
											CHRIS.flags.attempted_homework = "without knowledge";
										});										
									});
								}
								if (wing_it === "no winging it") {
									CHRIS.says(["Maybe I can find out", "what it's meant to be..."]);
								}
							});
						}
						if (attempt === "no attempt") {
							CHRIS.says(["I'd only get it wrong..."]);
						}
					}
				});
			}
		}
	},
	"e8_store_room_pens": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["What good is a pen to", "a rat in a cage?"]);
		} else {
			if (CHRIS.flags.has_pen) {
				CHRIS.says(["I have enough pens."]);
			} else {
				if (CHRIS.flags.needs_a_pen_for_kens_homework && !CHRIS.flags.has_renamed_kens_homework) {
					CHRIS.says(["Top quality pen. I'll just", "insert my name here..."]);
					CHRIS.says(["There. Now it's my homework."]);
					CHRIS.flags.has_renamed_kens_homework = true;
				} else {
					CHRIS.says(["Pens."]);
					CHRIS.chooses([{line: "...take one", result: "take"}, {line: "...don't", result: "leave"}]).and_then((pen_taken) => {
						if (pen_taken === "take") {
							CHRIS.flags.has_pen = true;
						}
						if (pen_taken === "leave") {
							CHRIS.says(["Stealing is wrong."]);
						}
					});
				}
			}
		}
	},
	"e8_store_room_books_left": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["Reading books got me", "into this mess..."]);
		} else {
			CHRIS.says(["Copies of Romeo and Juliet."]);
		}
	},
	"e8_store_room_books_right": function (interactor, other) {
		if (CHRIS.flags.needs_to_escape) {
			CHRIS.says(["Reading books got me", "into this mess..."]);
		} else {		
			if (!CHRIS.flags.has_completed_french_exam) {
				if (!CHRIS.flags.has_french_book && !CHRIS.flags.has_revised) {
					CHRIS.says(["Hmm... what's this blue one?", "A french book? What's this", "doing here?"]);
					CHRIS.chooses([{line: "...read it", result: "read"}, {line: "...leave it", result: "leave"}]).and_then((choice) => {
						if (choice === "read") {
							other.img = aoe.images.books_right_blue_gone;
							CHRIS.img = CHRIS.images.d_with_book;
							CHRIS.ignore_idle = true;
							CHRIS.says(['"Sans traduction sur Internet,', 'toute cette sous-histoire', 'n\'existerait pas."']).and_then(() => {
								CHRIS.pause_action(500);
								CHRIS.any_function_action(() => {
									CHRIS.says(["Dunno what that means."]);
									CHRIS.chooses([{line: "...revise", result: "revise"}, {line: "...take the book", result: "take book"}, {line: "...leave it", result: "leave"}]).and_then((choice2) => {
										if (choice2 === "revise") {
											CHRIS.says(["Hmm... maybe this", "will get me through the", "mock oral..."]).and_then(() => {
												aoe.engine.play_audio("time_passing");
												aoe.engine.image_box("revision_message").and_then(() => {
													aoe.engine.stop_audio("time_passing");
													CHRIS.says(["...lost track of time there..."]).and_then(() => {
														MR_F.remove_from_game();
														SAM.remove_from_game();
														VICKI.remove_from_game();
														MR_F_DESK.img = aoe.images.desk_v;
														E8_TO_HUT_ENTRANCE_DOOR.is_locked = true;
														HUT_ENTRANCE_TO_E8_DOOR.is_locked = true;
														CHRIS.flags.has_revised = true;
														CHRIS.face_action("up");
														other.img = aoe.images.books_right;
														CHRIS.ignore_idle = false;
													});
												});
											});
										}
										if (choice2 === "take book") {
											other.img = aoe.images.books_right_blue_gone;
											CHRIS.flags.has_french_book = true;
											CHRIS.pause_action(200);
											CHRIS.any_function_action(() => {
												CHRIS.face("down");
												CHRIS.says(["Never know when you'll", "need one of these do you?"]);
												CHRIS.ignore_idle = false;
											});
										}
										if (choice2 === "leave") {
											other.img = aoe.images.books_right;
											CHRIS.face_action("down");
											CHRIS.ignore_idle = false;
										}
									});
								});						
							});
						}
						if (choice === "leave") {
							CHRIS.says(["Yeah I hate French."]);
						}
					});
				}
				if (CHRIS.flags.has_french_book) {
					CHRIS.says(["Just more copies of", "Romeo and Juliet."]);
				}
				if (CHRIS.flags.has_revised) {
					CHRIS.says(["I can't fit any more", "French in my head."]);
				}
			}
			if (CHRIS.flags.has_completed_french_exam) {
				if (!CHRIS.flags.has_french_book && !CHRIS.has_revised) {
					CHRIS.says(["Huh... this blue one is", "a French book."]);
					CHRIS.says(["Bit late for that now."]);
				}
				if (CHRIS.flags.has_french_book) {
					CHRIS.says(["Just more copies of", "Romeo and Juliet"]);
				}
				if (CHRIS.flags.has_revised) {
					CHRIS.says(["That's enough French."]);
				}
			}
		}
	},
	"huts_main_exit": function (interactor, other) {
		let choices = [{line: "...stay here", result: "stay"}];
		if (!CHRIS.flags.has_completed_french_exam) {
			choices.push({line: "...go to the French exam", result: "french"});
		}
		choices.push({line: "...go home", result: "home"});
		
		CHRIS.chooses(choices).and_then((choice) => {
			if (choice === "home") {
				if (Object.keys(CHRIS.flags).length === 1 && CHRIS.flags.homework_conversation) {
					aoe.engine.scrolling_image("chris_went_home", 30000).and_then(() => {
						aoe.engine.end_game("straight_home");
					});
				} else {
					aoe.engine.stop_music()
					aoe.engine.image_box("the_boring_ending").and_then(() => {
						let treasured_memories = [];
						
						if (CHRIS.flags.french_exam_result === "failed-unplugged") {
							treasured_memories.push("being_difficult");
						}
						if (CHRIS.flags.french_exam_result === "failed-book") {
							treasured_memories.push("being_subtle");
						}
						if (CHRIS.flags.knows_about_eu) {
							treasured_memories.push("eu");
						}
						if (CHRIS.flags.homework_conversation === "successful lie") {
							treasured_memories.push("lying");
						}
						if (CHRIS.flags.onion === "taken") {
							treasured_memories.push("onion");
						}
						if (CHRIS.flags.didnt_walk_home_with_vicki) {
							treasured_memories.push("rejecting_vicki");
						}
						if (CHRIS.flags.homework_conversation === "run") {
							treasured_memories.push("running_away");
						}
						if (CHRIS.flags.has_read_gotd) {
							treasured_memories.push("story");
						}
						if (CHRIS.flags.has_poked_thermos) {
							treasured_memories.push("thermos");
						}
						if (CHRIS.flags.is_existentially_disturbed) {
							treasured_memories.push("window");
						}
						if (CHRIS.flags.knows_all_about_wool) {
							treasured_memories.push("wool");
						}

						if (treasured_memories.length === 0) {
							CHRIS.remove_from_game();
							VICKI.remove_from_game();
							aoe.engine.screens.hut_entrance.background_image = aoe.images.void_bg;
							CHRIS.pause_action(1000);
							CHRIS.any_function_action(() => {
								aoe.engine.image_box("nothing_interesting").and_then(() => {
									aoe.engine.end_game("nothing_interesting");
								});
							});
						} else {
							aoe.engine.set_music("treasured_memories");
							treasured_memories.forEach((memory) => {
								aoe.engine.image_box("treasured_memories_" + memory);
								aoe.engine.texts_to_display[aoe.engine.texts_to_display.length - 1].and_then(() => {
									aoe.engine.end_game("treasured_memories");
								})
							});
						}
			
					});
				}
			}
			if (choice === "french") {
				CHRIS.move_to(14, 10, "l5");
				aoe.engine.set_screen("l5");
				CHRIS.face_action("left");
				aoe.engine.set_music("la_marlaise");
				if (!CHRIS.flags.has_spoken_to_mrs_j) {
					CHRIS.pause_action(200);
					CHRIS.any_function_action(() => {
						MRS_J.says(["Chris!"]).and_then(() => {
							CHRIS.pause_action(200);
							CHRIS.walk_action("left", 1);
							CHRIS.walk_action("up", 3);
							CHRIS.interact_with_action(MRS_J);
						});					
					});
				}
			}
		});
	},
	"hut_entrance_coat": function (interactor, other) {
		if (!CHRIS.flags.onion) {
			CHRIS.says(["Someone left their coat..."]);
			CHRIS.chooses([{line: "...root around in the pockets", result: "root"}, {line: "...don't do that", result: "don't"}]).and_then((choice) => {
				if (choice === "root") {
					CHRIS.says(["Onion."]);
					CHRIS.chooses([{line: "...take it", result: "take"}, {line: "...leave it", result: "leave"}]).and_then((choice2) => {
						if (choice2 === "take") {
							CHRIS.flags.onion = "taken";
						}
						if (choice2 === "leave") {
							CHRIS.says(["Don't know where it's", "been do you?"]);
							CHRIS.flags.onion = "rejected";
						}
					});
				}
				if (choice === "don't") {
					CHRIS.says(["Looking in other people's", "pockets isn't right."]);
					CHRIS.flags.onion = "undiscovered";
				}
			});
		}
		if (CHRIS.flags.onion === "taken") {
			CHRIS.says(["No more onions in here."]);
		}
		if (CHRIS.flags.onion === "rejected") {
			CHRIS.says(["Nope, don't want an onion."]);
		}
		if (CHRIS.flags.onion === "undiscovered") {
			CHRIS.says(["I have no more business here."]);
		}
	},
	"mr_f_docking_station": function (interactor, other) {
		CHRIS.says(["Hmm... according to the rule", "book I shouldn't be able to", "interact with this..."]);
	},
	"n2_store_room_boxes": function (interactor, other) {
		if (!CHRIS.flags.wool_interactions) {
			CHRIS.flags.wool_interactions = 0;
		}
		
		if (CHRIS.flags.wool_interactions === 0) {
			CHRIS.says(["Wool."]);
		}
		if (CHRIS.flags.wool_interactions === 1) {
			CHRIS.says(["More wool."]);
		}
		if (CHRIS.flags.wool_interactions === 2) {
			CHRIS.says(["So much wool."]);
		}
		if (CHRIS.flags.wool_interactions === 3) {
			CHRIS.says(["Wool wool wool wool wool."]);
		}
		if (CHRIS.flags.wool_interactions === 4) {
			CHRIS.says(["Wool wool wool..."]);
			CHRIS.says(["...wool is a stupid word", "when you think about it."]);
		}
		if (CHRIS.flags.wool_interactions === 5) {
			CHRIS.says(["I'm sick of wool."]);
		}
		if (CHRIS.flags.wool_interactions === 6) {
			CHRIS.says(["Why can't I stop?"]);
		}		
		if (CHRIS.flags.wool_interactions === 7) {
			CHRIS.says(["I just want this to", "be over."]);
		}
		if (CHRIS.flags.wool_interactions === 8) {
			CHRIS.says(["I long for death, but", "there is only wool."]);
		}
		if (CHRIS.flags.wool_interactions === 9) {
			CHRIS.says(["Why is wool? What is", "wool?"]);
		}
		if (CHRIS.flags.wool_interactions === 10) {
			CHRIS.says(["What actually is wool??"]);
		}
		if (CHRIS.flags.wool_interactions === 11) {
			CHRIS.says(["WHAT ARE YOU???"]);
		}
		if (CHRIS.flags.wool_interactions === 12) {
			CHRIS.says(["WOOLWOOLWOOLWOOLWOOL", "WOOLWOOLWOOLWOOLWOOL"]);
		}
		if (CHRIS.flags.wool_interactions === 13) {
			CHRIS.says(["LWOOLWOOlwoo... lwoo?"]);
		}
		if (CHRIS.flags.wool_interactions === 14) {
			CHRIS.says(["oo lwoo woolo ol"]);
		}
		if (CHRIS.flags.wool_interactions === 15) {
			CHRIS.says(["llllll*7!w01111==#??!lllllooooooooooooooololololololol", "ollllwWW^^^^*oo10001011100==0001011101!===10"]);
		}
		if (CHRIS.flags.wool_interactions === 16) {
			aoe.engine.image_box("wool_warning");
			aoe.engine.image_box("wool_text").and_then( () => {
				aoe.engine.end_game("wool");
			});
		}
		
		CHRIS.flags.wool_interactions += 1;		
	},
	"n2_store_room_thread": function (interactor, other) {
		if (CHRIS.flags.has_thread) {
			CHRIS.says(["Just wool now."]);
		}
		if (!CHRIS.flags.has_thread) {
			CHRIS.says(["Wool..."]);
			CHRIS.says(["...and thread."]);
			if (CHRIS.flags.has_reason_to_take_thread) {
				CHRIS.says(["Perfect for making a tie", "hat with."]);
			}
			CHRIS.chooses([{line: "...take it", result: "take"}, {line: "...don't", result: "leave"}]).and_then((chris_takes_thread) => {
				if (chris_takes_thread === "take") {
					if (!CHRIS.flags.has_reason_to_take_thread) {
						CHRIS.says(["Sure, let's take thread", "for no reason."]);
					} else {
						// Nuffin
					}
					CHRIS.flags.has_thread = true;
					N2_STORE_ROOM_BOXES.img = aoe.images.n2_store_room_boxes_no_thread;
				} else if (chris_takes_thread === "leave") {
					if (!CHRIS.flags.has_reason_to_take_thread) {
						CHRIS.says(["Yeah, I don't need", "this for anything."]);
					} else {
						CHRIS.says(["Yes, why would I take that", "even though I could use it", "to make a tie hat?"]);
					}
				}
			});
		}
	},
	"sewing_machine": function (interactor, other) {
		if (!CHRIS.flags.has_made_tie_hat) {
			CHRIS.says(["A sewing machine left", "out. I have options..."]);
			CHRIS.chooses([{line: "...make a tie hat", result: "hat"}, {line: "...don't", result: "no hat"}]).and_then((make_a_hat) => {
				if (make_a_hat === "hat") {
					if (!CHRIS.flags.has_thread) {
						CHRIS.flags.has_reason_to_take_thread = true;
						CHRIS.says(["Hmm... no thread. You", "need thread for a tie hat..."]);						
					}
					if (CHRIS.flags.has_thread) {
						CHRIS.says(["..."]).and_then(() => {
							CHRIS.pause_action(500);
							CHRIS.any_function_action(() => {
								CHRIS.add_additional_image("tie_hat", 4, -6);
								CHRIS.images.r = aoe.images.chris_r_no_tie;
								CHRIS.images.d = aoe.images.chris_d_no_tie;
								CHRIS.images.l = aoe.images.chris_l_no_tie;
								CHRIS.images.r_walking = aoe.images.chris_r_walking_no_tie;
								CHRIS.images.d_walking = aoe.images.chris_d_walking_no_tie;
								CHRIS.images.l_walking = aoe.images.chris_l_walking_no_tie;
								CHRIS.images.r_blinking = aoe.images.chris_r_blinking_no_tie;
								CHRIS.images.d_blinking = aoe.images.chris_d_blinking_no_tie;
								CHRIS.images.l_blinking = aoe.images.chris_l_blinking_no_tie;
								CHRIS.images.d_with_book = aoe.images.chris_d_with_book_no_tie;
								CHRIS.images.r_kicking = aoe.images.chris_r_kicking_no_tie;
								CHRIS.flags.has_made_tie_hat = true;
								CHRIS.flags.is_wearing_tie_hat = true;
							});
						});
					} else if (make_a_hat === "no hat") {
						// Nuffin
					}
				}
			});
		} else {
			CHRIS.says(["Think I've done all I", "can here."]);
		}
	},
	"n2_blackboard": function (interactor, other) {
		aoe.engine.image_box("n2_whiteboard");
		CHRIS.flags.knows_all_about_wool = true;
	},
	"l5_door": function (interactor, other) {
		if (!CHRIS.flags.has_completed_french_exam) {
			MRS_J.face_other_person(CHRIS);
			MRS_J.says(["Um... where do you think", "you're going?"]).and_then(() => {
				CHRIS.face_action("up");
				CHRIS.pause_action(200);
				CHRIS.any_function_action(() => {
					MRS_J.says(["There's French to be spoken."]);
					CHRIS.chooses([{line: "...stay", result: "stay"}, {line: "...leave anyway", result: "leave"}]).and_then((decision) => {
						if (decision === "leave") {
							CHRIS.flags.has_completed_french_exam = true;
							CHRIS.flags.french_exam_result = "ran away";
							CHRIS.pause_action(500);
							CHRIS.face_action("right");
							CHRIS.any_function_action(() => {
								CHRIS.move_to(4, 7, "hut_entrance");
								CHRIS.face_action("up");
								aoe.engine.set_screen("hut_entrance");	
								if (aoe.engine.screens.e8.background_image === aoe.images.e8_fun_bg) {
									aoe.engine.set_music("fun", true);
								} else {
									aoe.engine.set_music("huts", true);
								}
							});
						}
					});
				});
			});
		}
		if (CHRIS.flags.has_completed_french_exam) {
			CHRIS.move_to(4, 7, "hut_entrance");
			CHRIS.face_action("up");
			aoe.engine.set_screen("hut_entrance");	
			if (aoe.engine.screens.e8.background_image === aoe.images.e8_fun_bg) {
				aoe.engine.set_music("fun", true);
			} else {
				aoe.engine.set_music("huts", true);
			}			
		}
	},
	"l5_boards_1": function (interactor, other) {
		if (!CHRIS.flags.knows_about_eu) {
			CHRIS.says(["'France and the EU'..."]);
			CHRIS.says(["'The European Union is", "lots of countries being friends.'"]);
			CHRIS.says(["'Scientists predict that", "in 20 years time, Britain and'"]);
			CHRIS.says(["'France will be absolute", "best buddies.'"]).and_then(() => {
				CHRIS.face_action("down");
				CHRIS.pause_action(500);
				CHRIS.any_function_action(() => {
					CHRIS.says(["I WONDER IF THAT", "WILL HAPPEN."]);
					CHRIS.flags.knows_about_eu = true;
				});
			});
		} else {
			CHRIS.says(["Politics is boring."]);
		}
	},
	"l5_boards_2": function (interactor, other) {
		if (CHRIS.has_revised) {
			CHRIS.says(["Le Tricolore!"]);
		} else {
			CHRIS.says(["Stripy french flag."]);
		}
	},
	"l5_boards_3": function (interactor, other) {	
		if (CHRIS.has_revised) {
			CHRIS.says(["All about the most famous", "french monuments."]);
		} else {
			CHRIS.says(["Some french writing and", "pictures of french stuff."]);
		}
	},
	"l5_boards_4": function (interactor, other) {	
		CHRIS.says(["It's a diagram of France."]);
	},
	"l5_tape_recorder": function (interactor, other) {
		if (CHRIS.flags.has_unplugged_tape_recorder && !CHRIS.flags.has_plugged_tape_recorder_back_in) {
			CHRIS.says(["Don't have to worry about", "this any more."]);
		} else {
			if (CHRIS.flags.has_revised) {
				CHRIS.says(["It'll all be on tape..."]);
			} else {
				CHRIS.says(["Ugh... it'll all be", "recorded..."]);
			}
		}
	},
	"l5_plug_socket": function (interactor, other) {
		if (!CHRIS.flags.has_unplugged_tape_recorder && !CHRIS.flags.has_completed_french_exam) {
			CHRIS.says(["Tape recorder is plugged", "in here..."]);
			CHRIS.chooses([{line: "...unplug it", result: "unplug"}, {line: "...leave it alone", result: "leave"}]).and_then((choice) => {
				if (choice === "unplug") {
					CHRIS.flags.has_unplugged_tape_recorder = true;
					aoe.engine.screens.l5.add_extra_image("unplugged", 256, 128);
					aoe.engine.play_audio("click_noise");
					MRS_J_DESK.img = aoe.images.desk_v_mrs_j_unplugged;
					CHRIS.pause_action(200);
					CHRIS.any_function_action(() => {
						MRS_J.face_other_person(CHRIS);
						MRS_J.says(["What are you doing?"]).and_then(() => {
							CHRIS.pause_action(500);
							CHRIS.face_action("left");
							CHRIS.any_function_action(() => {
								CHRIS.says(["..."]);
								MRS_J.says(["Did you think I wouldn't hear", "you rustling round down there?"]);
								CHRIS.says(["..."]);
								MRS_J.says(["Plug it back in."]);
								CHRIS.chooses([{line: "...comply", result: "comply"}, {line: "...don't", result: "don't"}]).and_then((response) => {
									if (response === "comply") {
										CHRIS.flags.has_plugged_tape_recorder_back_in = true;
										CHRIS.face_action("right");
										CHRIS.pause_action(200);
										CHRIS.any_function_action(() => {
											aoe.engine.play_audio("click_noise");
											aoe.engine.screens.l5.remove_extra_images_with_key("unplugged");
											MRS_J_DESK.img = aoe.images.desk_v_mrs_j;
										}); 
										CHRIS.pause_action(200);
										CHRIS.face_action("left");
										CHRIS.any_function_action(() => {
											MRS_J.says(["Tu as le QI d'une huitre..."]);
										});
									}
									if (response === "don't") {
										CHRIS.says(["..."]);
										MRS_J.says(["..."]);
										CHRIS.says(["...shan't."]);
										MRS_J.says(["Fine. I'll mark you as failed."]);
										MRS_J.says(["And see you for detention.", "Every night forever."]);
										CHRIS.flags.has_completed_french_exam = true;
										CHRIS.flags.french_exam_result = "failed-unplugged";
									}
								});
							});
						});
					});
				} else {
					// Nuffin
				}
			});
		} else if (CHRIS.flags.has_unplugged_tape_recorder) {
			if (CHRIS.flags.has_plugged_tape_recorder_back_in) {
				CHRIS.says(["I had my chance."])
			} else {
				if (CHRIS.flags.has_revised) {
					CHRIS.says(["...why did I do this after", "all that revision?"]);
				} else {
					CHRIS.says(["At least I didn't have", "to talk French."])
				}
			}
		} else if (CHRIS.flags.has_completed_french_exam) {
			CHRIS.says(["Tape recorder is plugged", "in here..."]);
			CHRIS.says(["...no point messing with", "it now."]);
		}
	},
};

// M   M  RRRRR         FFFFF
// MM MM  R   R         F
// M M M  RRRRR         FFFF
// M   M  RRR           F
// M   M  R  RR         F       

aoe.interactions.person_mr_f = {
	"door": function (interactor, other) {
		if (!other.is_locked) {
			if (MR_F.screen_ref === "e8_store_room" && other.destination_screen_ref === "n2_store_room") {
				MR_F.says(["This bit of wall always", "bugs me..."]);
			} else {
				MR_F.move_to(other.destination_x, other.destination_y, other.destination_screen_ref);
				aoe.engine.set_screen(other.destination_screen_ref);
			}
		} else {
			MR_F.says(["Locked."]);
		}
	},
	"desk": function (interactor, other) {
		// Desk stuff
	},
	"person_chris": function (interactor, other) {
		if (SAM.screen_ref === CHRIS.screen_ref) {
			MR_F.says(["What are you lads", "up to?"]);
			CHRIS.says(["Oh nothing..."]);
		} else {
			MR_F.says(["How do?"]);
			CHRIS.says(["Alright."]);
			MR_F.says(["Good conversation."]);
		}
	},
	"person_vicki": function (interactor, other) {
		VICKI.says(["Hi."]);
		MR_F.says(["Hello."]);
	},	
	"person_sam": function (interactor, other) {
		SAM.says(["I don't know how this", "interaction has occurred."]);
		SAM.says(["Has someone been fiddling", "in the dev tools console?"]);
	},		
	"e8_window": function (interactor, other) {
		MR_F.says(["Wish I had a proper building.", "Even Graphics isn't in a hut."]);
	},	
	"e8_boards_bottom": function (interactor, other) {
		MR_F.says(["Little Colin bless him. Sweet", "kid. Shame his story is awful."]);
		MR_F.says(["Still, you've got to", "encourage them haven't you?"]);
	},		
	"e8_boards_middle": function (interactor, other) {
		MR_F.says(["I wish I didn't have to", "teach them to write adverts."]);
		MR_F.says(["Sad little world."]);
	},
	"e8_boards_top": function (interactor, other) {
		MR_F.says(["Might make a display of", "the Shakespeare stuff here."]);
	},
	"e8_thermos": function (interactor, other) {
		if (MR_F.flags.the_time_has_not_come) {
			MR_F.says(["Not yet."]);
		} else if (!MR_F.flags.the_time_has_not_come) {
			MR_F.says(["...has the time come?"]);
			MR_F.chooses([{line: "...the time has come", result: "it has come"}, {line: "...the time hasn't come", result: "not now"}]).and_then((the_time_has_come) => {
				if (the_time_has_come === "it has come") {
					aoe.engine.stop_music();
					aoe.engine.play_audio("thermos");
					MR_F.accepting_input = false;
					MR_F_DESK.img = aoe.images.thermos_stage_1;
					MR_F_DESK.animation = aoe.animations.thermos_stage_1;
					MR_F.pause_action(2000);
					MR_F.any_function_action(() => {
						aoe.engine.full_screen_animation("thermos_stage_2", "thermos_stage_2", false).and_then(() => {
							aoe.engine.full_screen_animation("thermos_stage_3", "thermos_stage_3", false).and_then(() => {
								aoe.engine.image_box("whiteout").and_then(() => {
									aoe.engine.end_game("thermos");
								});
							});
						});
					});
				}
				if (the_time_has_come === "not now") {
					MR_F.says(["No... everything needs to", "be just right."]);
					MR_F.flags.the_time_has_not_come = true;
				}
			});
		}
	},
	"e8_homework_pile": function (interactor, other) {
		MR_F.says(["Looks like I have homework", "in from everyone."]).and_then(() => {
			MR_F.face_action("down");
			MR_F.pause_action(200);
			MR_F.any_function_action(() => {
				MR_F.says(["Except Chris."]);
			});			
		});
	},
	"e8_blackboard": function (interactor, other) {
		MR_F.says(["Th-th-th-th-th-th-th-th"]);
	},
	"e8_poster": function (interactor, other) {
		MR_F.says(["I love Anthony Hopkins."]);
	},		
	"e8_store_room_box": function (interactor, other) {
		MR_F.says(["A well stocked classroom", "is to learning what"]);
		MR_F.says(["a nice chianti is to", "liver."]);
	},
	"e8_store_room_paper": function (interactor, other) {
		MR_F.says(["Paper."]);
	},
	"e8_store_room_pens": function (interactor, other) {
		if (CHRIS.flags.has_pen) {
			MR_F.says(["Heyyy... one of these", "pens has gone AWOL."]);
			MR_F.says(["I'll have to give all my", "classes the pen theft talk."]);
		} else {
			MR_F.says(["73 pens, all present and", "correct."]);
		}
	},		
	"e8_store_room_books_left": function (interactor, other) {
		MR_F.says(["Romeo and Juliet. Why", "is it always Shakespeare?"]);
		MR_F.says(["There are other playwrights.", "Maybe Pinter or something?"]);
	},	
	"e8_store_room_books_right": function (interactor_other) {
		if (!CHRIS.flags.has_french_book) {
			MR_F.says(["Not sure how this French", "book got here..."]);
		} else {
			if (MR_F.flags.is_suspicious) {
				MR_F.says(["There's a book missing...", "...Chris must be pinching books."]);
			} else {
				MR_F.says(["Huh... a missing book."]);
			}
		}
	},
	"huts_main_exit": function (interactor, other) {
		MR_F.chooses([{line: "...stay here", result: "stay"}, {line: "...go home", result: "go"}]).and_then((choice) => {
			if (choice === "go") {
				MR_F.says("I'll be off then...");
				MR_F.any_function_action(() => {
					MR_F.is_player_controlled = false;
					MR_F.accepting_input = false;
					CHRIS.is_player_controlled = true;
					CHRIS.accepting_input = true;
					aoe.engine.set_screen(CHRIS.screen_ref);	
					MR_F.remove_from_game();
				});

			}
		});
	},
	"hut_entrance_coat": function (interactor, other) {
		MR_F.says(["Someone went home cold", "I guess."]);
	},
	"mr_f_docking_station": function (interactor, other) {
		MR_F.chooses([{line: "...dock", result: "dock"}, {line: "...don't", result: "no dock"}]).and_then((dock) => {
			if (dock === "dock") {
					MR_F.is_player_controlled = false;
					MR_F.accepting_input = false;
					CHRIS.is_player_controlled = true;
					CHRIS.accepting_input = true;
					aoe.engine.set_screen(CHRIS.screen_ref);
					MR_F.any_function_action(() => {
						other.hide();		
						MR_F.move_to(other.grid_x, other.grid_y, other.screen_ref);
						MR_F.face("down");
					});
			}
		});
	},
	"n2_store_room_boxes": function (interactor, other) {
		MR_F.says(["Wool."]);
	},	
	"n2_store_room_thread": function (interactor, other) {
		MR_F.says(["Wool and a bit of thread."]);
	},
	"sewing_machine": function (interactor, other) {
		MR_F.says(["Why can't that textiles", "woman clean up after class?"]);
	},
	"n2_blackboard": function (interactor, other) {
		MR_F.says(["Knitting stuff. Not", "interested."]);
	},
};

const french_gibberish = function () {
	const starters = ["Je suis ", "Il fait ", "Il y a ", "J'aime", "Je ne ", "Un ", "Une ", "Je vais "];
	const middles1 = ["le boef ", "la poulet ", "allez a la ", "M. ", "patinoire ", "le natation ", "rouge ", "un peu de "];
	const middles2 = ["de la ", "en croute ", "de France ", "dans le ", "avec la ", "sur la", "en raison de ", "habit en "];
	const enders = ["mer.", "et la chien.", "bleu.", "Francais.", "a droite.", "tres bien.", "temps de temps.", "anglais."];
	
	const rand = function (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	};
	
	return [rand(starters) + rand(middles1), rand(middles2) + rand(enders)];
};
