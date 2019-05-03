var entity = new MobileCRM.FetchXml.Entity("kc_questionnaire_template");
entity.addAttribute("kc_questionnaire_templateid");
entity.addAttribute("kc_name");
var fetch = new MobileCRM.FetchXml.Fetch(entity);
fetch.execute(
	"Array",
	function (result) {
		for (var i in result) {
			var template = result[i];
			var select = document.getElementById('template');
			var opt = document.createElement('option');
			opt.value = template[0];
			opt.innerHTML = template[1];
			select.appendChild(opt);
		}
	},
	function (err) {
		MobileCRM.bridge.alert("Ошибка при запросе шаблонов опросов: " + err);
	},
	null
);

var questions = [];

function select_questionnaire_template() {
	var select = document.getElementById('template');
	var templateId = select.options[select.selectedIndex].value;
	var entity_question = new MobileCRM.FetchXml.Entity("kc_questionnaire_question");
	entity_question.addAttribute("kc_questionnaire_questionid");
	entity_question.addAttribute("kc_name");
	entity_question.addAttribute("kc_description");
	entity_question.addAttribute("kc_questionnaire_questiontypecode");
	entity_question.addAttribute("kc_isrequired");
	entity_question.addAttribute("kc_score");
	entity_question.orderBy("kc_index", false);
	var linkEntity_question = entity_question.addLink("kc_questionnaire_template_question", "kc_questionnaire_questionid", "kc_questionnaire_questionid", "inner");
	linkEntity_question.filter = new MobileCRM.FetchXml.Filter();
	linkEntity_question.filter.where("kc_questionnaire_templateid", "eq", templateId);
	var fetch = new MobileCRM.FetchXml.Fetch(entity_question);
	fetch.execute(
		"Array",
		function (result) {
			var html = "";
			for (var i in result) {
				var question = result[i];
				questions.push({ id: question[0], type: question[3], name: question[1], required: question[4], score: question[5] });
				var placeholder = "";
				html += "<div class='row'> \
					<h4>" + question[1] + "</h4>"
				if (question[2]) {
					html += "<h5>" + question[2] + "</h5>";
					placeholder = question[2];
				}
				html += "<div class='input-group'>";
				if (question[3] == 1) {
					html += "<input id='" + question[0] + "' type='text' placeholder='" + placeholder + "'>"
				}
				if (question[3] == 2) {
					html += "<input id='" + question[0] + "' type='number' step='1' placeholder='" + placeholder + "'>"
				}
				if (question[3] == 3) {
					html += "<input id='" + question[0] + "' type='number' placeholder='" + placeholder + "'>"
				}
				if (question[3] == 4) {
					html += "<input id='" + question[0] + "' type='date' placeholder='" + placeholder + "'>"
				}
				if (question[3] == 5) {
					html += "<input id='" + question[0] + "' type='datetime-local' placeholder='" + placeholder + "'>"
				}
				if (question[3] == 6) {	
					var optionId = question[0];
					html += "<select id='" + optionId + "'>";	
					html += "</select>";
					var entity_option = new MobileCRM.FetchXml.Entity("kc_questionnaire_option");
					entity_option.addAttribute("kc_questionnaire_optionid");
					entity_option.addAttribute("kc_name");
					entity_option.addAttribute("kc_description");
					entity_option.addAttribute("kc_score");
					entity_option.filter = new MobileCRM.FetchXml.Filter();
					entity_option.filter.where("kc_recordtypecode", "eq", 1);
					entity_option.orderBy("kc_index", false);
					var linkEntity_option = entity_option.addLink("kc_questionnaire_question_option", "kc_questionnaire_optionid", "kc_questionnaire_optionid", "inner");
					linkEntity_option.filter = new MobileCRM.FetchXml.Filter();
					linkEntity_option.filter.where("kc_questionnaire_questionid", "eq", question[0]);
					var fetch_option = new MobileCRM.FetchXml.Fetch(entity_option);
					fetch_option.execute(
						"Array",
						function (result_option) {
							var html_option = "<option></option>";
							for (var j in result_option) {
								var option = result_option[j];
								var tooltip = "";
								if (option[2])
									tooltip = option[2];
								var score_option = 0;
								if (option[3])
									score_option = option[3];
								html_option += "<option value='" + score_option + "' title='" + tooltip + "'>" + option[1] + "</option>"
							}
							document.getElementById(optionId).innerHTML += html_option;	
						},
						function (err) {
							MobileCRM.bridge.alert("Ошибка при запросе опций вопросов: " + err);
						},
						null
					);					
				}
				if (question[3] == 7) {	
					var optionMultiId = question[0];
					html += "<select id='" + optionMultiId + "' multiple>";	
					html += "</select>";					
					var entity_option_multi = new MobileCRM.FetchXml.Entity("kc_questionnaire_option");
					entity_option_multi.addAttribute("kc_questionnaire_optionid");
					entity_option_multi.addAttribute("kc_name");
					entity_option_multi.addAttribute("kc_description");
					entity_option_multi.addAttribute("kc_score");
					entity_option_multi.filter = new MobileCRM.FetchXml.Filter();
					entity_option_multi.filter.where("kc_recordtypecode", "eq", 1);
					entity_option_multi.orderBy("kc_index", false);
					var linkEntity_option_multi = entity_option_multi.addLink("kc_questionnaire_question_option", "kc_questionnaire_optionid", "kc_questionnaire_optionid", "inner");
					linkEntity_option_multi.filter = new MobileCRM.FetchXml.Filter();
					linkEntity_option_multi.filter.where("kc_questionnaire_questionid", "eq", question[0]);
					var fetch_option_multi = new MobileCRM.FetchXml.Fetch(entity_option_multi);
					fetch_option_multi.execute(
						"Array",
						function (result_option_multi) {
							var html_option_multi = "";
							for (var j in result_option_multi) {
								var option = result_option_multi[j];
								var tooltip = "";
								if (option[2])
									tooltip = option[2];
								var score_option = 0;
								if (option[3])
									score_option = option[3];
								html_option_multi += "<option value='" + score_option + "' title='" + tooltip + "'>" + option[1] + "</option>"
							}
							document.getElementById(optionMultiId).innerHTML += html_option_multi;	
						},
						function (err) {
							MobileCRM.bridge.alert("Ошибка при запросе опций вопросов: " + err);
						},
						null
					);					
				}
				if (question[3] == 8) {
					html += "<input type='radio' name='" + question[0] + "' value='true' id='" + question[0] + "_true'/> \
							<label for='" + question[0] + "_true'>Да</label> \
							<input type='radio' name='" + question[0] + "' value='false' id='" + question[0] + "_false' checked='true'/> \
							<label for='" + question[0] + "_false'>Нет</label>";
				}
				html += "</div> \
					</div>";
			}
			html += "<div class='row'> \
					<div class='input-group'> \
						<input class='button' type='button' value='Готово' onclick='createInstance()'> \
					</div> \
				</div>";
			document.getElementById("form2").innerHTML += html;
			document.getElementById("form1").style.display="none";
			document.getElementById("form2").style.display="block";
		},
		function (err) {
			MobileCRM.bridge.alert("Ошибка при запросе вопросов: " + err);
		},
		null
	);
}

function createInstance() {
	var isEmptyRequired = false;
	var globalScore = 0;
	questions.forEach(function(element) {
		if (element.type != 8) 
		{
			var val = document.getElementById(element.id).value;
			if (!val) {
				if (element.required == "True") {
					MobileCRM.bridge.alert("На заполнено обязательное поле: " + element.name);
					isEmptyRequired = true;
				}
			}
			else {
				if (element.type != 6 && element.type != 7 && element.type != 8) {
					globalScore += Number(element.score);
				}
				else if (element.type != 6) {
					var select_val = document.getElementById(element.id);
					val = select_val.options[select_val.selectedIndex].value;						
					if (val) {
						globalScore += Number(val);	
					}						
				}
				else if (element.type != 7) {
					var select_val = document.getElementById(element.id);
					val = select_val.options;						
					if (val) {
						for (var i = 0; i < val.length; i++) {
							var opt = val[i];
							if (opt.selected) {
								globalScore += Number(opt.value);
							}
						}					
					}
				}
			}
		}
		else {
			var val = document.getElementById(element.id + "_true").checked;				
			if (val) {
				globalScore += Number(element.score);
			}
		}
	});
	if (isEmptyRequired)
		return;
	var select = document.getElementById('template');
	var templateId = select.options[select.selectedIndex].value;
	var templateName = select.options[select.selectedIndex].text;
	var instance = MobileCRM.DynamicEntity.createNew("kc_questionnaire_instance");
	var instance_props = instance.properties;
	instance_props.kc_questionnaire_templateid = new MobileCRM.Reference("kc_questionnaire_template", templateId);
	instance_props.kc_name = templateName;
	instance_props.kc_summaryscore = Number(globalScore);
	instance.save(
		function (error) {
			if (error)
				MobileCRM.bridge.alert("Ошибка при создании опросного листа: " + error);
			else {
				var newId = this.id;	
				questions.forEach(function(element) {
					var answer = MobileCRM.DynamicEntity.createNew("kc_questionnaire_answer");
					var answer_props = answer.properties;
					answer_props.kc_questionnaire_instanceid = new MobileCRM.Reference("kc_questionnaire_instance", newId);
					answer_props.kc_questionnaire_questionid = new MobileCRM.Reference("kc_questionnaire_question", element.id);
					answer_props.kc_name = element.name;
					if (element.type == 1) {
						var val = document.getElementById(element.id).value;					
						if (val)
						{
							answer_props.kc_value_text = val;
							answer_props.kc_score = element.score;
						}
					}
					if (element.type == 2) {
						var val = document.getElementById(element.id).value;						
						if (val)
						{
							answer_props.kc_value_whole = Math.round(val);
							answer_props.kc_score = element.score;
						}
					}
					if (element.type == 3) {
						var val = document.getElementById(element.id).value;
						if (val)
						{
							answer_props.kc_value_decimal = val;					
							answer_props.kc_score = element.score;
						}
					}
					if (element.type == 4) {
						var val = document.getElementById(element.id).value;				
						if (val)
						{
							answer_props.kc_value_date = val;
							answer_props.kc_score = element.score;
						}
					}
					if (element.type == 5) {
						var val = document.getElementById(element.id).value;				
						if (val)
						{
							answer_props.kc_value_datetime = new Date(val);
							answer_props.kc_score = element.score;
						}
					}
					if (element.type == 6) {
						var select_val = document.getElementById(element.id);
						var val = select_val.options[select_val.selectedIndex].value;						
						if (val) {
							answer_props.kc_score = val;					
						}
					}
					if (element.type == 7) {
						var select_val = document.getElementById(element.id);
						var val = select_val.options;						
						if (val) {
							var score = 0;
							for (var i = 0; i < val.length; i++) {
								var opt = val[i];
								if (opt.selected) {
									score += Number(opt.value);
								}
							}
							answer_props.kc_score = Number(score);					
						}
					}
					if (element.type == 8) {
						var val = document.getElementById(element.id + "_true").checked;				
						if (val)
						{
							answer_props.kc_value_boolean = val;
							answer_props.kc_score = element.score;
						}
					}
					answer.save(
						function (answer_error) {
							if (answer_error)
								MobileCRM.bridge.alert("Ошибка при создании ответа: " + element.name + " " + answer_error);
							else {
								if (element.type == 6) {
									var select_val = document.getElementById(element.id);
									var val = select_val.options[select_val.selectedIndex].value;	
									var text = select_val.options[select_val.selectedIndex].text;						
									if (val)
									{
										var option = MobileCRM.DynamicEntity.createNew("kc_questionnaire_option");
										var option_props = option.properties;
										option_props.kc_recordtypecode = 2;
										option_props.kc_name = text;
										option_props.kc_questionnaire_answerid = new MobileCRM.Reference("kc_questionnaire_answer", this.id);
										option_props.kc_score = val;
										option.save(
											function (option_error) {
												if (option_error)
													MobileCRM.bridge.alert("Ошибка при создании опции ответа: " + option_error);
											}
										);
									}
								}
								if (element.type == 7) {
									var select_val = document.getElementById(element.id);
									var val = select_val.options;						
									if (val) {
										for (var i = 0; i < val.length; i++) {
											var opt = val[i];
											if (opt.selected) {										
												var option = MobileCRM.DynamicEntity.createNew("kc_questionnaire_option");
												var option_props = option.properties;
												option_props.kc_recordtypecode = 2;
												option_props.kc_name = opt.text;
												option_props.kc_questionnaire_answerid = new MobileCRM.Reference("kc_questionnaire_answer", this.id);
												option_props.kc_score = opt.value;
												option.save(
													function (option_error) {
														if (option_error)
															MobileCRM.bridge.alert("Ошибка при создании опции ответа: " + option_error);
													}
												);							
											}
										}				
									}
								}
							}
						}
					);
				});
				MobileCRM.bridge.closeForm();
			}
		}
	);
}