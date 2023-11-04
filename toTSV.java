import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class toTSV {
    public static void main(String[] args) throws IOException {
        String txtInput = "input.txt"; //input file from gpt
        List<String> inputNotes = splitFile(txtInput); //creates list of "term - definition"
        String outputNotes = "output.tsv"; //output file

        FileWriter fileWriter = new FileWriter(outputNotes);

        for (String eachNote : inputNotes) {
            String[] termDef = eachNote.split(" - "); //splits the term and definition
            if (termDef.length == 2) { //if there are 2 terms (there should be)
                fileWriter.write(termDef[0] + "\t" + termDef[1] + "\n"); //adds term, tab, definition, newline
            }
        }
        fileWriter.close();

        System.out.print("Notes written");
    }

    private static List<String> splitFile(String file) throws IOException {
        String fileContents = "";

        try { //turns .txt file into string
            FileReader fileReader = new FileReader(file);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            StringBuilder stringBuilder = new StringBuilder();
            String line;

            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }

            bufferedReader.close();
            fileReader.close();
            fileContents = stringBuilder.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String[] terms = fileContents.split("\\. "); //splits the string into "term - definition"
        List<String> termList = new ArrayList<>();

        for (String term : terms) {
            termList.add(term.trim()); //adds to termlist
        }

        return termList;
    }
}
